!macro customInstall
  ; Show progress for n8n-dist extraction
  DetailPrint "Installing n8n resources..."
  
  ; Extract the pre-compressed n8n-dist.zip
  DetailPrint "Extracting n8n-dist resources..."
  
  ; Use NSIS built-in zip extraction (more efficient than PowerShell)
  nsisunz::UnzipToLog "$INSTDIR\resources\n8n-dist.zip" "$INSTDIR\resources"
  
  ; Check if extraction was successful
  Pop $0
  ${If} $0 == "OK"
    DetailPrint "n8n resources extracted successfully!"
    ; Clean up the zip file after successful extraction
    Delete "$INSTDIR\resources\n8n-dist.zip"
  ${Else}
    DetailPrint "ERROR: Failed to extract n8n resources!"
    MessageBox MB_OK|MB_ICONSTOP "Failed to extract n8n resources. Please try reinstalling the application."
  ${EndIf}
!macroend

!macro customUnInstall
  ; Clean up n8n resources
  DetailPrint "Removing n8n resources..."
  RMDir /r "$INSTDIR\resources\n8n-dist"
!macroend
