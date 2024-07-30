Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class Win32 {
        [DllImport("user32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
        
        [DllImport("user32.dll")]
        public static extern IntPtr GetForegroundWindow();
        
        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        
        [DllImport("user32.dll")]
        public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);
        
        public const int SW_RESTORE = 9;
        public const byte VK_CONTROL = 0x11;
        public const byte VK_S = 0x53;
        public const uint KEYEVENTF_KEYUP = 0x0002;
    }
"@

function Focus-WindowByPID($pid) {
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if ($process -eq $null) {
        Write-Error "No process found with PID $pid"
        return
    }
    
    $hwnd = $process.MainWindowHandle
    if ($hwnd -eq [IntPtr]::Zero) {
        Write-Error "The process does not have a main window handle"
        return
    }
    
    [Win32]::ShowWindow($hwnd, [Win32]::SW_RESTORE)
    [Win32]::SetForegroundWindow($hwnd)
    
    # Wait a bit to ensure the window is focused
    Start-Sleep -Milliseconds 500
    
    # Send Ctrl+S
    [Win32]::keybd_event([Win32]::VK_CONTROL, 0, 0, 0)
    [Win32]::keybd_event([Win32]::VK_S, 0, 0, 0)
    [Win32]::keybd_event([Win32]::VK_S, 0, [Win32]::KEYEVENTF_KEYUP, 0)
    [Win32]::keybd_event([Win32]::VK_CONTROL, 0, [Win32]::KEYEVENTF_KEYUP, 0)
}

# Usage: Replace 1234 with the actual PID you want to focus
Focus-WindowByPID 2000