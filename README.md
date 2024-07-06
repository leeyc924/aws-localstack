python version 3.12.3
```console
brew install localstack/tap/localstack-cli
```
```console
python3 -m pip config set global.break-system-packages true
```
```console
docker run --rm -it -p 4566:4566 -p 4571:4571 localstack/localstack
```

pip로 python 패키지 관리
```console
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
```
```console
python3 get-pip.py
```

```console
pip install awscli
```
```console
pip install awscli-local
```
