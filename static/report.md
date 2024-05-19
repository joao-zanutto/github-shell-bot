## Running script `{{ command }}`

{{#result}}

```bash
{{ line }}
```

{{#output.stdout}}

<details>
  <summary>stdout</summary>

```
{{ this }}
```

{{/output.stdout}}

</details>

{{#output.stderr}}

<details>
  <summary>stderr</summary>
  
  ```
  {{ this }}
  ```

</details>

{{/output.stderr}}

---

{{/result}}

Shell Butler script report
