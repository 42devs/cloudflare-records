# Cloudflare DNS Management Action

This GitHub Action allows you to create and update DNS records for Cloudflare.
It is designed to simplify DNS management within your CI/CD workflows.

## Usage

To use this action, add the following step to your GitHub Actions workflow:

```yaml
- name: Manage Cloudflare DNS
  uses: your-username/your-repo@v1
  with:
    type: 'A' # DNS record type (e.g., "A", "CNAME", etc.)
    name: 'example.com' # DNS record name
    content: '192.0.2.1' # DNS record content (e.g., IP address or text)
    ttl: '1' # Time to live (default: "1" for automatic)
    proxied: 'false' # Whether the record is proxied through Cloudflare (default: "false")
    token: ${{ secrets.CLOUDFLARE_TOKEN }} # Cloudflare API token
    zone: ${{ secrets.CLOUDFLARE_ZONE_ID }} # Cloudflare zone ID
```

### Inputs

| Input     | Description                                                          | Required | Default   |
| --------- | -------------------------------------------------------------------- | -------- | --------- |
| `type`    | DNS record type (e.g., "A", "CNAME", etc.)                           | Yes      | -         |
| `name`    | DNS record name (e.g., "example.com")                                | Yes      | -         |
| `content` | DNS record content (e.g., IP address or text)                        | Yes      | -         |
| `ttl`     | Time to live for the DNS record (value of `1` is automatic)          | No       | `"1"`     |
| `proxied` | Whether the record is proxied through Cloudflare (`true` or `false`) | No       | `"false"` |
| `token`   | Cloudflare API token (store this in GitHub Secrets)                  | Yes      | -         |
| `zone`    | Cloudflare zone ID (store this in GitHub Secrets)                    | Yes      | -         |

### Outputs

| Output      | Description                          |
| ----------- | ------------------------------------ |
| `record_id` | The ID of the created/updated record |
| `name`      | The affected domain name             |

### Example Workflow

Here’s an example workflow that uses this action to create or update a DNS
record:

```yaml
name: Update Cloudflare DNS
on: [push]

jobs:
  update-dns:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Manage Cloudflare DNS
        uses: 42devs/cloudflare-records@v1
        with:
          type: 'A'
          name: 'example.com'
          content: '192.0.2.1'
          ttl: '1'
          proxied: 'false'
          token: ${{ secrets.CLOUDFLARE_TOKEN }}
          zone: ${{ secrets.CLOUDFLARE_ZONE_ID }}
```

### Branding

- **Icon**: :cloud:
- **Color**: Orange

### Author

This action is created and maintained by
[Nicolas Martinez V](mailto:nicolas@42devs.cl).

### License

This project is licensed under the [MIT License](LICENSE).

---

For more information, visit the
[GitHub repository](https://github.com/your-username/your-repo).
