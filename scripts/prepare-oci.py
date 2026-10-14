"""Preserve the current SQLite database and JWT; patch only public build settings."""
from pathlib import Path
import subprocess,json,sqlite3,shutil,os,datetime,sys
assert os.geteuid()==0,'Run with sudo'
root=Path('/var/www/Unisystem')
def inspect(name):return json.loads(subprocess.check_output(['docker','inspect',name]))[0]
api=inspect('unisystem-api');front=inspect('unisystem-frontend')
assert api['Config']['Labels']['com.docker.compose.project']=='unisystem'
mount=[m for m in api['Mounts'] if m['Destination']=='/app/database']
assert len(mount)==1 and mount[0]['Name']=='unisystem_unisystem-db-data','Existing database volume required'
db=Path(mount[0]['Source'])/'unisystem.db';assert db.is_file(),'Existing database required'
env=root/'.env';original=env.read_text() if env.exists() else ''
current=dict(v.split('=',1) for v in api['Config']['Env'] if '=' in v)
jwt=current.get('Jwt__Secret');assert jwt,'Existing JWT required'
values=dict(line.split('=',1) for line in original.splitlines() if '=' in line and not line.lstrip().startswith('#'))
assert values.get('UNISYSTEM_JWT_SECRET','').strip().strip('"\u0027')==jwt,'Existing private environment must preserve JWT'
if '--check' in sys.argv:
 print('Existing project, SQLite volume/file and JWT environment validated')
 raise SystemExit(0)
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
backup=Path('/var/backups/unisystem')/('workflow-cutover-'+stamp);backup.mkdir(parents=True,mode=0o700)
shutil.copy2(env,backup/'env-before');(backup/'env-before').chmod(0o600)
with sqlite3.connect('file:'+str(db)+'?mode=ro',uri=True) as source,sqlite3.connect(backup/'unisystem.db') as target:
 source.backup(target)
(backup/'unisystem.db').chmod(0o600)
(backup/'containers-before.json').write_text(json.dumps([api,front]));(backup/'containers-before.json').chmod(0o600)
for name,data in [('unisystem-api',api),('unisystem-frontend',front)]:subprocess.run(['docker','image','tag',data['Image'],name+':before-subdomain-'+stamp],check=True)
updates={'UNISYSTEM_BASE_HREF':'/','UNISYSTEM_API_URL':'/api'};seen=set();lines=[]
for line in original.splitlines():
 key=line.partition('=')[0].strip()
 if key in updates:
  if key not in seen:lines.append(key+'='+updates[key]);seen.add(key)
 else:lines.append(line)
lines.extend(key+'='+value for key,value in updates.items() if key not in seen)
env.write_text('\n'.join(lines)+'\n')
print('Private SQLite/config/image backup:',backup)
print('JWT and database volume preserved; two public build settings applied')
