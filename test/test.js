import { spawnSync } from "child_process"
import ffmpegPath from "ffmpeg-static"
import path from "path"

const a = String.raw`C:\Users\xinghai>ffmpeg -i F:\work\视频切片-2026-07\source\11040070003536102_去水印.mp4
ffmpeg version N-118072-gce457bfccd-20241216 Copyright (c) 2000-2024 the FFmpeg developers
  built with gcc 14.2.0 (crosstool-NG 1.26.0.120_4d36f27)
  configuration: --prefix=/ffbuild/prefix --pkg-config-flags=--static --pkg-config=pkg-config --cross-prefix=x86_64-w64-mingw32- --arch=x86_64 --target-os=mingw32 --enable-gpl --enable-version3 --disable-debug --disable-w32threads --enable-pthreads --enable-iconv --enable-zlib --enable-libfreetype --enable-libfribidi --enable-gmp --enable-libxml2 --enable-lzma --enable-fontconfig --enable-libharfbuzz --enable-libvorbis --enable-opencl --disable-libpulse --enable-libvmaf --disable-libxcb --disable-xlib --enable-amf --enable-libaom --enable-libaribb24 --enable-avisynth --enable-chromaprint --enable-libdav1d --enable-libdavs2 --enable-libdvdread --enable-libdvdnav --disable-libfdk-aac --enable-ffnvcodec --enable-cuda-llvm --enable-frei0r --enable-libgme --enable-libkvazaar --enable-libaribcaption --enable-libass --enable-libbluray --enable-libjxl --enable-libmp3lame --enable-libopus --enable-librist --enable-libssh --enable-libtheora --enable-libvpx --enable-libwebp --enable-libzmq --enable-lv2 --enable-libvpl --enable-openal --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenh264 --enable-libopenjpeg --enable-libopenmpt --enable-librav1e --enable-librubberband --enable-schannel --enable-sdl2 --enable-libsoxr --enable-libsrt --enable-libsvtav1 --enable-libtwolame --enable-libuavs3d --disable-libdrm --enable-vaapi --enable-libvidstab --enable-vulkan --enable-libshaderc --enable-libplacebo --disable-libvvenc --enable-libx264 --enable-libx265 --enable-libxavs2 --enable-libxvid --enable-libzimg --enable-libzvbi --extra-cflags=-DLIBTWOLAME_STATIC --extra-cxxflags= --extra-libs=-lgomp --extra-ldflags=-pthread --extra-ldexeflags= --cc=x86_64-w64-mingw32-gcc --cxx=x86_64-w64-mingw32-g++ --ar=x86_64-w64-mingw32-gcc-ar --ranlib=x86_64-w64-mingw32-gcc-ranlib --nm=x86_64-w64-mingw32-gcc-nm --extra-version=20241216
  libavutil      59. 51.100 / 59. 51.100
  libavcodec     61. 27.101 / 61. 27.101
  libavformat    61.  9.101 / 61.  9.101
  libavdevice    61.  4.100 / 61.  4.100
  libavfilter    10.  6.101 / 10.  6.101
  libswscale      8. 12.100 /  8. 12.100
  libswresample   5.  4.100 /  5.  4.100
  libpostproc    58.  4.100 / 58.  4.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'F:\work\视频切片-2026-07\source\11040070003536102_去水印.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf61.9.101
  Duration: 01:41:00.01, start: 0.000000, bitrate: 1354 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(progressive), 1280x720 [SAR 1:1 DAR 16:9], 1219 kb/s, 25 fps, 25 tbr, 12800 tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
      encoder         : Lavc61.27.101 libx264
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 129 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
At least one output file must be specified
`

const result = a.match(/Duration: (\d+):(\d+):(.*?),/)
console.log(+result[1] * 3600 + +result[2] * 60 + +result[3])
let TotalTime = 0
const sourcePath = 'F:/work/去水印'
const fileList = ['11040070003536102.mp4','11040567833536102.mp4']
// 获取总时长（秒）
for (let file of fileList) {
    const result = spawnSync(ffmpegPath, ["-i", path.join(sourcePath, file)])
    const time = result.stderr.toString().match(/Duration: (\d+):(\d+):(.*?),/)
    TotalTime += (+time[1] * 3600 + +time[2] * 60 + +time[3])

}

console.log(TotalTime)

const abc = "frame= 8152 fps=1626 q=31.0 size=N/A time=00:05:26.67 bitrate=N/A speed=65.1x".match(/time=(\d+):(\d+):(\d+.\d+\d) /)

console.log(abc)