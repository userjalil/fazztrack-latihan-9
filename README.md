
# Latihan Sesi 9
Menggunakan source code express-fazztrack-3 

<br/>


## Jalankan aplikasi secara lokal

Clone source express-fazztrack-3
```sh
  git clone https://gitlab.com/ebyantoo/express-fazztrack-3
```

Masuk ke folder proyek
```bash
  cd express-fazztrack-3
```

Install dependencies
```bash
  npm install
```

Edit file `config/config.json` untuk koneksi database, sebagai percobaan cukup menggunakan environment development
```javascript
  "development": {
    "username": "jalil",
    "password": "devops",
    "database": "express_fazztrack_3",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
```

Buat user dan database PostgreSQL sekaligus memberikan hak akses terhadap database
```bash
  postgres=# create role jalil login password 'devops';
  postgres=# create database express_fazztrack_3 with owner=jalil;
  postgres=# GRANT ALL PRIVILEGES ON DATABASE express_fazztrack_3 TO jalil;
```

Buat tabel pada database
```bash
  npx sequelize-cli db:migrate
```

Tambah contoh data ke tabel user
```bash
  npx sequelize-cli db:seed:all
```

Jalankan aplikasi
```bash
  npm run dev
```
<br/>

## Dockerize
