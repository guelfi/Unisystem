const fs = require('node:fs');
// Unpatched braces used by Angular/Karma build tooling; never shipped in the static image.
const knownDevelopmentAdvisory = 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm';
function check(report, lock) {
  if (!report.vulnerabilities || !report.metadata?.vulnerabilities || !lock.packages) {
    throw new Error('A complete npm audit report and lockfile are required');
  }
  const vulnerabilities = report.vulnerabilities;
  function leaves(name, seen = new Set()) {
    if (seen.has(name)) return [];
    const visited = new Set([...seen, name]);
    const value = vulnerabilities[name];
    if (!value) throw new Error(`Missing advisory dependency: ${name}`);
    return value.via.flatMap(v => typeof v === 'string' ? leaves(v, visited)
      : ['high', 'critical'].includes(v.severity) ? [v.url] : []);
  }
  const blocked = [], reviewed = [];
  for (const [name, value] of Object.entries(vulnerabilities)) {
    if (!['high', 'critical'].includes(value.severity)) continue;
    const ids = leaves(name);
    const onlyDevelopment = value.nodes.length > 0 && value.nodes.every(path => lock.packages[path]?.dev === true);
    if (onlyDevelopment && ids.length > 0 && ids.every(id => id === knownDevelopmentAdvisory)) reviewed.push(name);
    else blocked.push(name);
  }
  return { blocked, reviewed };
}
module.exports = { check };
if (require.main === module) {
  const result = check(JSON.parse(fs.readFileSync(process.argv[2])), JSON.parse(fs.readFileSync(process.argv[3])));
  console.log(`Reviewed development-only advisory chains: ${result.reviewed.length}`);
  if (result.blocked.length) {
    console.error('Unreviewed or production High/Critical dependencies:', result.blocked.join(', '));
    process.exit(1);
  }
  console.log('No unreviewed or production High/Critical dependencies');
}
