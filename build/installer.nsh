!macro customInstall
  ; Show progress for n8n-dist extraction
  DetailPrint "Installing n8n resources..."
  
  ; Extract the pre-compressed n8n-dist.zip
  DetailPrint "Extracting n8n-dist resources..."
  nsExec::ExecToLog 'cmd /c "cd $INSTDIR\resources && powershell -command \"Expand-Archive -Path n8n-dist.zip -DestinationPath . -Force\""'
  
  ; Clean up the zip file after extraction
  Delete "$INSTDIR\resources\n8n-dist.zip"
  
  DetailPrint "n8n resources installed successfully!"
!macroend

!macro customUnInstall
  ; Clean up n8n resources
  DetailPrint "Removing n8n resources..."
  RMDir /r "$INSTDIR\resources\n8n-dist"
!macroend
