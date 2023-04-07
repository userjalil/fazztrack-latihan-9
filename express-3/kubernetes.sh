echo " Membuat secret"
echo "================"
sleep 3s
kubectl create -f kubernetes/secret.yaml

echo "\n"
echo " Deploy PostgreSQL"
echo "==================="
sleep 3s
kubectl create -f kubernetes/postgres.yaml

echo "\n"
echo " Deploy express-fazztrack-3"
echo "============================"
sleep 3s
kubectl create -f kubernetes/express.yaml

echo "\n"
echo " Menampilkan hasil deploy"
echo "=========================="
sleep 10s
kubectl get all

echo "\n"
echo " Status aplikasi express-fazztrack-3"
echo "====================================="
sleep 15s
kubectl logs -l app=express-3

echo "\n"
echo " Melakukan ekspos Service dengan minikube"
echo "=========================================="
sleep 5s
minikube service express-3-service