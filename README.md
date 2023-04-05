
# Tugas Sesi 9

Source code menggunakan express-fazztrack-3




## Jalankan aplikasi secara lokal

Clone source express-fazztrack-3
```sh
git clone https://gitlab.com/ebyantoo/express-fazztrack-3
```

Masuk ke direktori proyek
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

## Pengujian menggunakan Postman

Pengujian yang dilakukan yaitu tambah data, tampilkan data, ubah data dan menghapus data

- Tambah data 
![tambah data](https://snipboard.io/MPNuFl.jpg)

- Tampilkan data
![tampil data](https://snipboard.io/nzFb1e.jpg)

Terdapat dua data yang telah ada didalam database. Dikarenakan sebelumnya ketika perintah `npx sequelize-cli db:seed:all` dijalankan, maka sebuah data telah ditambahkan kedalam database.

- Ubah data dengan `id:3` dengan `firstname=user2`
![ubah data](https://snipboard.io/Kks8EP.jpg)

- Periksa hasil perubahan data
![periksa data](https://snipboard.io/TaFhgs.jpg)

- Hapus data dengan `id:4` dengan `firstname=nabati`
![hapus data](https://snipboard.io/4gFat9.jpg)

- Tampilkan kembali data users untuk memastikan data dengan `id:4` telah terhapus
![tampil hapus](https://snipboard.io/Ll0gJd.jpg)
## Build Docker Image
Buat direktori lalu pindahkan source code aplikasi kedalam direktori `app`
```bash
mkdir app
mv * app/
```

Buat file baru dengan nama `Dockerfile`
```
FROM node:18-alpine
EXPOSE 3000
WORKDIR /app
ADD /app/package*.json ./
RUN npm install
ADD app/. ./
```

Buat image Docker
```bash
docker build -t userjalil/express-fazztrack-3:1.0 . 
```


## Jalankan aplikasi menggunakan `docker-compose`
Buat file baru dengan nama `docker-compose.yml`
```
version: "3.7"

services:
  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=jalil
      - POSTGRES_DB=express_fazztrack_3
      - POSTGRES_PASSWORD=devops
    networks:
      psql:
        ipv4_address: 172.30.0.2

  app:
    image: userjalil/express-fazztrack-3:1.0
    ports:
      - "3000:3000"
    environment:
      - username=jalil
      - password=devops
      - database=express_fazztrack_3
      - host=db
    depends_on:
      - db
    networks:
      psql:
        ipv4_address: 172.30.0.3
    command: /bin/sh -c "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm run dev"

networks:
  psql:
    ipam:
      driver: default
      config:
        - subnet: 172.30.0.0/24
```
Jalankan aplikasi
```bash
docker-compose up -d
```
Periksa status container
```bash
docker-compose logs
```
Lakukan [pengujian menggunakan postman](##-pengujian-menggunakan-postman) seperti sebelumnya.
## Jalankan aplikasi menggunakan `kubernetes`
