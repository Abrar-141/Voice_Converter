$ErrorActionPreference = 'Stop'

$roots = @('d:\Voice_Converter\frontend\src', 'd:\Voice_Converter\admin\src')

# 1. Koi .css file components/ ya pages/ mein bachi toh nahi?
Write-Output '=== CSS files outside src/css/ (should be none) ==='
$stray = Get-ChildItem $roots -Recurse -File -Include *.css |
    Where-Object { $_.DirectoryName -notlike '*\src\css' }
if ($stray) { $stray | ForEach-Object { 'STRAY: ' + $_.FullName } } else { Write-Output 'none - clean' }

# 2. Har css import resolve hota hai ya nahi
Write-Output ''
Write-Output '=== CSS import path check ==='
$bad = 0
$files = Get-ChildItem $roots -Recurse -File -Include *.jsx, *.css
foreach ($f in $files) {
    foreach ($line in (Get-Content $f.FullName)) {
        if ($line -match "(?:import|@import)\s+['""]([^'""]*\.css)['""]") {
            $rel = $Matches[1]
            $target = [IO.Path]::GetFullPath((Join-Path $f.DirectoryName $rel))
            if (Test-Path $target) {
                Write-Output ('OK    ' + $f.FullName.Replace('d:\Voice_Converter\', '') + '  ->  ' + $rel)
            } else {
                Write-Output ('FAIL  ' + $f.FullName.Replace('d:\Voice_Converter\', '') + '  ->  ' + $rel)
                $bad++
            }
        }
    }
}
Write-Output ''
Write-Output "broken imports = $bad"
