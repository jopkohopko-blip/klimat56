# Публикация сайта на Cloudflare Pages: https://klimat56.pages.dev
# Запуск: .\deploy.ps1   (нужен вход: npx wrangler login)
$ErrorActionPreference = 'Stop'
$src = $PSScriptRoot
$dist = Join-Path $src 'dist'

if (Test-Path $dist) { Remove-Item -Recurse -Force $dist }
New-Item -ItemType Directory $dist | Out-Null
Copy-Item "$src\*.html" $dist
Copy-Item -Recurse "$src\css", "$src\js", "$src\fonts" $dist
if (Test-Path "$src\img") { Copy-Item -Recurse "$src\img" $dist }
# Пока сайт черновой — запрещаем индексацию поисковиками
Set-Content -Path "$dist\robots.txt" -Value "User-agent: *`nDisallow: /" -Encoding ascii

npx --yes wrangler@4 pages deploy $dist --project-name klimat56 --branch main --commit-dirty=true
