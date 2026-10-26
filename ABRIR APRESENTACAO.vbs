Option Explicit
Dim shell, files, folder, nodePath, serverPath, nodeCommand
Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
folder = files.GetParentFolderName(WScript.ScriptFullName)
nodePath = files.BuildPath(folder, "runtime\node.exe")
serverPath = files.BuildPath(folder, "server.mjs")
If Not files.FileExists(nodePath) Then
  nodePath = files.BuildPath(shell.ExpandEnvironmentStrings("%ProgramFiles%"), "nodejs\node.exe")
  If Not files.FileExists(nodePath) Then
    MsgBox "Instale Node.js ou mantenha a pasta completa da entrega com runtime\node.exe.", 48, "Casa Demarchi"
    WScript.Quit 1
  End If
End If
shell.CurrentDirectory = folder
nodeCommand = Chr(34) & nodePath & Chr(34) & " " & Chr(34) & serverPath & Chr(34)
shell.Run nodeCommand, 0, False
WScript.Sleep 1200
shell.Run "http://127.0.0.1:4173/#conceito", 1, False
