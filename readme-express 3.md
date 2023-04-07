
# Latihan Sesi 9

Source code menggunakan express-fazztrack-3




## Jalankan aplikasi secara lokal

Clone source express-fazztrack-3
```bash
git clone https://gitlab.com/ebyantoo/express-fazztrack-3
```

Masuk ke direktori proyek
```bash
cd express-fazztrack-3
````

Install dependencies
```bash
npm install
```

Edit file config/config.json untuk koneksi database, sebagai percobaan cukup menggunakan environment development
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

Tambah data 
![tambah data](https://raw.githubusercontent.com/userjalil/fazztrack-latihan-9/main/screenshot_express_3/tambah%20data.png)

Tampilkan data
![tampil data](https://raw.githubusercontent.com/userjalil/fazztrack-latihan-9/main/screenshot_express_3/tampil%20awal%20data.png)

Terdapat dua data yang telah ada didalam database karena sebelumnya ketika perintah `npx sequelize-cli db:seed:all` dijalankan, maka sebuah data telah ditambahkan kedalam database.

Ubah data dengan `id:1` dengan `firstname=user2`
![ubah data](https://raw.githubusercontent.com/userjalil/fazztrack-latihan-9/main/screenshot_express_3/ubah%20data.png)

Periksa hasil perubahan data
![periksa data](https://raw.githubusercontent.com/userjalil/fazztrack-latihan-9/main/screenshot_express_3/tampil%20ubah%20data.png)

Hapus data dengan `id:2` dengan `firstname=nabati`
![hapus data](https://raw.githubusercontent.com/userjalil/fazztrack-latihan-9/main/screenshot_express_3/hapus%20data.png)

Tampilkan kembali data users untuk memastikan data dengan `id:4` telah terhapus
![tampil hapus](https://raw.githubusercontent.com/userjalil/fazztrack-latihan-9/main/screenshot_express_3/tampil%20hapus%20data.png)
## Build Docker Image
Buat direktori `app` lalu pindahkan source code aplikasi kedalam direktori tersebut
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

Ubah nilai variabel `"host"` pada file `config/config.json` menjadi `psql-service`. Variabel ini nantinya akan digunakan ketika membuat file konfigurasi docker-compose, jadi container untuk database postgreSQL akan menggunakan nama ini agar container express dapat berkomunikasi dengan container postgreSQL.
```javascript
"development": {
  "username": "jalil",
  "password": "devops",
  "database": "express_fazztrack_3",
  "host": "psql-service",
  "dialect": "postgres"
}
```

Buat image Docker dengan format `<username docker hub>/<nama image>:<versi>` agar memudahkan ketika melakukan upload ke docker hub
```bash
docker build -t userjalil/fazztrack-express-3:1.0 . 
```


## Jalankan aplikasi menggunakan Docker Compose
Buat file baru dengan nama `docker-compose.yml`
```yml
version: '3'

services:
  psql-service:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: jalil
      POSTGRES_PASSWORD: devops
      POSTGRES_DB: express_fazztrack_3

  express-3:
    image: userjalil/fazztrack-express-3:1.0
    depends_on:
      - psql-service
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DB_HOST: psql-service
    command: /bin/sh -c " npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm run dev "
```
Jalankan aplikasi
```bash
docker-compose up -d
```
Periksa status container
```bash
docker-compose logs
```
Bagian ini menunjukkan bahwa aplikasi sedang berjalan
![node start](https://github.com/userjalil/fazztrack-latihan-9/blob/main/screenshot_express_3/Screenshot_1.png?raw=true)

Bagian ini menunjukkan bahwa database telah berjalan normal
![node db](https://github.com/userjalil/fazztrack-latihan-9/blob/main/screenshot_express_3/Screenshot_2.png?raw=true)

Setelah semuanya berjalan normal, lakukan kembali [pengujian menggunakan postman](#pengujian-menggunakan-Postman).

## Upload image ke Docker Hub
Login ke docker hub
```bash
docker login
```

Masukkan username dan password akun docker hub
```code
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: userjalil
Password: 
Login Succeeded
```

Jalankan perintah `docker push <nama image>/<versi>`
```bash
docker push userjalil/fazztrack-express-3:1.0
```

![docker push](https://github.com/userjalil/fazztrack-latihan-9/blob/main/screenshot_express_3/Screenshot_3.png?raw=true)
## Jalankan aplikasi menggunakan Kubernetes

Buat direktori untuk menyimpan semua file konfigurasi kubernetes dengan nama `kubernetes` lalu masuk kedalam direktori tersebut
```bash
mkdir kubernetes
cd kubernetes
```

Tidak seperti docker compose dimana data username dan password yang sifatnya rahasia langsung dituliskan didalamnya, untuk menyimpan data rahasia seperti itu kita bisa menggunakan object yang disebut Secret. 

Data username dan password yang dituliskan didalam object secret sudah dalam bentuk encode base64. 
```bash
$ echo -n "jalil" | base64
amFsaWw=
$ echo -n "devops" | base64
ZGV2b3Bz
```

Buat file baru dengan nama `secret.yaml`
```yaml
apiVersion: v1
apiVersion: v1
kind: Secret
metadata:
  name: psql-secret
type: Opaque
data:
  psql-username: amFsaWw=
  psql-password: ZGV2b3Bz
```

Jalankan file `secret.yaml`
```bash
kubectl create -f secret.yaml
```

Buat file baru dengan nama `postgres.yaml`
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-db
  labels:
    app: postgres
spec:
  selector:
    matchLabels:
      app: db-psql
  serviceName: postgres-statefulset
  replicas: 2
  template:
    metadata:
      labels:
        app: db-psql
    spec:
      containers:
        - name: db-psql
          image: postgres:14-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: express_fazztrack_3
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: psql-secret
                  key: psql-username
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: psql-secret
                  key: psql-password
          volumeMounts:
            - name: db-psql-volume
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: db-psql-volume
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: psql-service
  labels:
    app: postgres
spec:
  selector:
    app: db-psql
  ports:
    - port: 5432
      targetPort: 5432
```

Jalankan file `postgres.yaml`
```bash
kubectl create -f postgres.yaml
```

Buat file baru dengan nama `express.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-express-3
  labels:
    app: express-3
spec:
  replicas: 1
  selector:
    matchLabels:
      app: express-3
  template:
    metadata:
      labels:
        app: express-3
    spec:
      containers:
        - name: express-3
          image: userjalil/fazztrack-express-3:1.0
          ports:
            - containerPort: 3000
          env:
            - name: username
              valueFrom:
                secretKeyRef:
                  name: psql-secret
                  key: psql-username
            - name: password
              valueFrom:
                secretKeyRef:
                  name: psql-secret
                  key: psql-password
            - name: DB_HOST
              value: psql-service
          command:
            [
              "/bin/sh",
              "-c",
              "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && npm run dev",
            ]
---
apiVersion: v1
kind: Service
metadata:
  name: express-3-service
  labels:
    app: express-3
spec:
  selector:
    app: express-3
  type: LoadBalancer
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30001
```

Jalankan file `express.yaml`
```bash
kubectl create -f express.yaml
```

Pastikan file konfigurasi yang dibuat barusan berjalan dengan baik
```bash
kubectl get all
```
![kubectl all](https://github.com/userjalil/fazztrack-latihan-9/blob/main/screenshot_express_3/kubectl-all.png?raw=true)

Periksa juga pod aplikasi express_fazztrack_3
```bash
kubectl logs deploy-express-3-769bcf8d7-2rg76
```
![kubectl pod](https://github.com/userjalil/fazztrack-latihan-9/blob/main/screenshot_express_3/kubectl-pod.png?raw=true)

Karena kubernetes dijalankan menggunakan minikube dan bantuan docker desktop, maka harus melakukan ekspos service dari minikube untuk mengakses aplikasi express_fazztrack_3 
```bash
minikube service express-3-service
```
![minikube](https://github.com/userjalil/fazztrack-latihan-9/blob/main/screenshot_express_3/minikube.png?raw=true)

Maka akan muncul alamat yang dapat digunakan untuk mengakses aplikasi express_fazztrack_3 seperti yang ditunjukkan gambar diatas.
```
http://127.0.0.1:39843
```
