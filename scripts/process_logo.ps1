Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\Administrator\.gemini\antigravity-ide\scratch\choco-loco\frontend\public\assets\real_choco_loco_logo_raw.jpg"
$outputPath = "c:\Users\Administrator\.gemini\antigravity-ide\scratch\choco-loco\frontend\public\assets\real_choco_loco_logo.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$width = $bmp.Width
$height = $bmp.Height
Write-Host "Image size: $width x $height"

# Create a 32-bit ARGB bitmap
$outBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast processing
$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$outData = $outBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$strideIn = $bmpData.Stride
$strideOut = $outData.Stride

$inBytes = New-Object byte[] ($strideIn * $height)
$outBytes = New-Object byte[] ($strideOut * $height)

[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $inBytes, 0, $inBytes.Length)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $idxIn = ($y * $strideIn) + ($x * 3)
        $idxOut = ($y * $strideOut) + ($x * 4)

        $b = [int]$inBytes[$idxIn]
        $g = [int]$inBytes[$idxIn + 1]
        $r = [int]$inBytes[$idxIn + 2]

        # The logo is dark brown/chocolate: r is ~40-100, g is ~15-60, b is ~10-40, and highlights are lighter chocolate.
        # The checkerboard background has neutral grays: |r-g| < 12 and |r-b| < 12 and r > 160 (or white/light gray squares).
        # Let's check if the pixel is part of the checkerboard pattern:
        $isNeutral = ([Math]::Abs($r - $g) -lt 15) -and ([Math]::Abs($r - $b) -lt 15) -and ([Math]::Abs($g - $b) -lt 15)
        
        # If it's a checkerboard pixel (light gray ~204 or white ~255):
        if ($isNeutral -and ($r -gt 155)) {
            # Fully transparent
            $outBytes[$idxOut] = 0
            $outBytes[$idxOut + 1] = 0
            $outBytes[$idxOut + 2] = 0
            $outBytes[$idxOut + 3] = 0
        } elseif ($isNeutral -and ($r -gt 135)) {
            # Smooth feather edge
            $alpha = [byte]([Math]::Max(0, [Math]::Min(255, (155 - $r) * 12)))
            $outBytes[$idxOut] = [byte]$b
            $outBytes[$idxOut + 1] = [byte]$g
            $outBytes[$idxOut + 2] = [byte]$r
            $outBytes[$idxOut + 3] = $alpha
        } else {
            # Logo pixel
            $outBytes[$idxOut] = [byte]$b
            $outBytes[$idxOut + 1] = [byte]$g
            $outBytes[$idxOut + 2] = [byte]$r
            $outBytes[$idxOut + 3] = 255
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($outBytes, 0, $outData.Scan0, $outBytes.Length)

$bmp.UnlockBits($bmpData)
$outBmp.UnlockBits($outData)

$outBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
$outBmp.Dispose()

Write-Host "Processed transparent PNG saved to $outputPath"
