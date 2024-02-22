using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

namespace MoreMountains.Tools
{
    public class WebGLUtils
    {
        [DllImport("__Internal")]
        private static extern bool IsMobile();

        public static bool isMobile()
        {
#if !UNITY_EDITOR && UNITY_WEBGL
        return IsMobile();
#elif UNITY_EDITOR
        return UnityEngine.Device.SystemInfo.deviceType != DeviceType.Desktop;
#endif
        }
    }
}