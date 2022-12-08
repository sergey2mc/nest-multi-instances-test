### How to generate TLS certificate for Redis server in production

1 Generate 2048-bit RSA Private key

```
openssl genrsa -out redis-key.key 2048 
```

2 Generate Certificate Signing Request (CSR) file

```
openssl req -new -sha256 -key redis-key.key -out redis-csr.pem
```

3 Generate certificate

```
openssl x509 -req -in redis-csr.pem -signkey redis-key.key -out redis-cert.crt
```

See https://nodejs.org/api/tls.html#tlsssl-concepts
