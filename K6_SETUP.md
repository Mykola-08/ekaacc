# Test Environment Setup Notes

## Installing k6

k6 is not available as an npm package. Install it separately:

### Linux (Debian/Ubuntu)
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### macOS (Homebrew)
```bash
brew install k6
```

### Windows (Chocolatey)
```bash
choco install k6
```

### Docker
```bash
docker pull grafana/k6
```

## Running k6 Tests with Docker

If k6 is not installed locally, you can run tests using Docker:

```bash
# Basic load test
docker run --rm -i -v $(pwd)/load-tests:/load-tests \
  grafana/k6 run /load-tests/basic-load.js

# API stress test
docker run --rm -i -v $(pwd)/load-tests:/load-tests \
  grafana/k6 run /load-tests/api-stress.js

# With custom base URL
docker run --rm -i -e BASE_URL=https://your-app.com \
  -v $(pwd)/load-tests:/load-tests \
  grafana/k6 run /load-tests/basic-load.js
```

## Alternative: Artillery

If k6 is not available, you can use Artillery as an alternative:

```bash
npm install -D artillery

# Run a simple load test
artillery quick --count 10 --num 20 http://localhost:9002
```

## CI/CD Considerations

For GitHub Actions or other CI/CD platforms, k6 can be installed in the workflow:

```yaml
- name: Install k6
  run: |
    curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
    sudo mv k6-v0.47.0-linux-amd64/k6 /usr/local/bin/k6
    
- name: Run load tests
  run: npm run test:load
```
