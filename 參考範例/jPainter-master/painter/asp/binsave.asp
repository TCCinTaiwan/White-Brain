<%
'---------------------------------------------------------
' Converts text data to binary
'---------------------------------------------------------
Function StringToBinary(S)
	Dim i, ByteArray
	For i=1 to Len(S)
	ByteArray = ByteArray & ChrB(Asc(Mid(S,i,1)))
	Next
	StringToBinary = ByteArray
End Function


'---------------------------------------------------------
' Decodes BASE64 encoded data.
'---------------------------------------------------------
Function Base64Decode(Byval base64String)
  Const Base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  Dim dataLength, sOut, groupBegin
  
  base64String = Replace(base64String, vbCrLf, "")
  base64String = Replace(base64String, vbTab, "")
  base64String = Replace(base64String, " ", "")
  
  dataLength = Len(base64String)
  If dataLength Mod 4 <> 0 Then
    Err.Raise 1, "Base64Decode", "Bad Base64 string."
    Exit Function
  End If
  
  For groupBegin = 1 To dataLength Step 4
    Dim numDataBytes, CharCounter, thisChar, thisData, nGroup, pOut
    numDataBytes = 3
    nGroup = 0

    For CharCounter = 0 To 3
      thisChar = Mid(base64String, groupBegin + CharCounter, 1)
      If thisChar = "=" Then
        numDataBytes = numDataBytes - 1
        thisData = 0
      Else
        thisData = Instr(Base64, thisChar) - 1
      End If
      If thisData = -1 Then
        Err.Raise 2, "Base64Decode", "Bad character In Base64 string."
        Exit Function
      End If
      nGroup = 64 * nGroup + thisData
    Next
    
    nGroup = Hex(nGroup)
    nGroup = String(6 - Len(nGroup), "0") & nGroup
    pOut = Chr(CByte("&H" & Mid(nGroup, 1, 2))) + _
      Chr(CByte("&H" & Mid(nGroup, 3, 2))) + _
      Chr(CByte("&H" & Mid(nGroup, 5, 2)))
    
    sOut = sOut & Left(pOut, numDataBytes)
  Next

  Base64Decode = sOut
End Function


'----------------------------------------------------------------
' Saves base64 encoded image in binary mode to the specified file
'----------------------------------------------------------------
Sub SaveToBinFile(FileName, Byval Base64String)
    ' Decode BASE64 encoded image to PNG
    DecodeString = Base64Decode(Base64String)
    ' Convert to Binary
    ImageData = StringToBinary(DecodeString)

    ' Save to the specified file in binary mode
    Dim oFS, oFile
    Dim nIndex
	
    Set oFS = Server.CreateObject("Scripting.FileSystemObject")	
    Set oFile = oFS.CreateTextFile(FileName, True)
		
    For nIndex = 1 to LenB(ImageData)
	oFile.Write Chr(AscB(MidB(ImageData,nIndex,1)))
    Next
    oFile.Close    
End Sub

%>