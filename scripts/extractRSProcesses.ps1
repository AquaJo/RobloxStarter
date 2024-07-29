# PowerShell script to list roblox-studio processes and parse them as object(array)

$processes = Get-Process | Where-Object { $_.Name -like "RobloxStudio*" } | ForEach-Object {
    $process = $_
    $windowTitle = $process.MainWindowTitle

    if ($windowTitle -ne "") {
        [PSCustomObject]@{
            ProcessId = $process.Id
            Name = $process.Name
            WindowTitle = $windowTitle
        }
    }
}


$processes | ConvertTo-Json -Depth 3
