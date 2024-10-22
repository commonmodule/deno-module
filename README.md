# deno-module

## Run test entrypoint
```
deno run --allow-net --allow-read --watch test/entrypoint.ts
```

## Clear cache
```
deno cache --reload https://raw.githubusercontent.com/yjgaia/deno-module/main/api.ts
rm deno.lock
```