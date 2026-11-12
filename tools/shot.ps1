# Headless render check for one toy: <repo>\<Slug>\index.html.
# Shims requestAnimationFrame onto timers so animation runs under virtual time,
# saves a screenshot to tools\_out and prints every console message.
param(
  [Parameter(Mandatory = $true)][string]$Slug,
  [int]$Width = 1280,
  [int]$Height = 900,
  [int]$Budget = 4000,
  [string]$Tag = "desk",
  [string]$InjectFile = "",
  [switch]$NoRafShim
)
$t = $PSScriptRoot
$root = Split-Path -Parent $t
$out = Join-Path $t "_out"
New-Item -ItemType Directory -Force $out | Out-Null
$src = Get-Content -Raw -Encoding UTF8 (Join-Path $root "$Slug\index.html")

$shim = ""
if (-not $NoRafShim) {
  $shim = '<script>(function(){window.requestAnimationFrame=function(cb){return setTimeout(function(){cb(performance.now())},16)};window.cancelAnimationFrame=function(id){clearTimeout(id)}})();</script>'
}
$inject = ""
if ($InjectFile -ne "") { $inject = "<script>" + (Get-Content -Raw -Encoding UTF8 $InjectFile) + "</script>" }

# shim must run before page scripts; probe runs after them
$i = $src.IndexOf("<head>")
if ($i -ge 0) { $src = $src.Insert($i + 6, $shim) } else { $src = $shim + $src }
$j = $src.LastIndexOf("</body>")
if ($j -ge 0) { $src = $src.Insert($j, $inject) } else { $src = $src + $inject }

$page = Join-Path $out "$Slug.page.html"
[IO.File]::WriteAllText($page, $src, (New-Object Text.UTF8Encoding $false))

$prof = Join-Path $env:TEMP ("toy-edge-" + $Slug + "-" + $Tag + "-" + (Get-Random))
$png = Join-Path $out "$Slug-$Tag.png"
$err = Join-Path $out "$Slug-$Tag.err"
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$url = "file:///" + ($page -replace '\\', '/')
$args2 = @("--headless=new", "--no-first-run", "--disable-extensions", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  "--user-data-dir=`"$prof`"", "--enable-logging=stderr", "--v=0", "--virtual-time-budget=$Budget",
  "--window-size=$Width,$Height", "--screenshot=`"$png`"", $url)
$p = Start-Process -FilePath $edge -ArgumentList $args2 -RedirectStandardError $err -RedirectStandardOutput "$err.out" -PassThru -Wait
"screenshot: $png (exit $($p.ExitCode))"
$lines = Get-Content $err | Select-String -Pattern 'CONSOLE' | Where-Object { $_.Line -notmatch 'chrome-extension://' }
if ($lines) { "console:"; $lines | ForEach-Object { $_.Line } } else { "console: no messages" }
try { Remove-Item -Recurse -Force $prof -ErrorAction Stop } catch {}
