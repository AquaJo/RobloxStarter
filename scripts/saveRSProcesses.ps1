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
    

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("kernel32.dll")]
    public static extern uint GetCurrentThreadId();

    [DllImport("user32.dll")]
    public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

    
    public const int SW_RESTORE = 9;
    public const byte VK_CONTROL = 0x11;
    public const byte VK_S = 0x53;
    public const uint KEYEVENTF_KEYUP = 0x0002;
}
"@

function Save-WindowByPID {
    param (
        [int]$ProcessId
    )

    $process = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
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
    Start-Sleep -Milliseconds 1500 # adjust if save not working! (maybe fix in the future)
    
    # Send Ctrl+S
    [Win32]::keybd_event([Win32]::VK_CONTROL, 0, 0, 0)
    [Win32]::keybd_event([Win32]::VK_S, 0, 0, 0)
    [Win32]::keybd_event([Win32]::VK_S, 0, [Win32]::KEYEVENTF_KEYUP, 0)
    [Win32]::keybd_event([Win32]::VK_CONTROL, 0, [Win32]::KEYEVENTF_KEYUP, 0)
}

# Call the function
Save-WindowByPID $args[0]
