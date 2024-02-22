using UnityEngine;

public class Example : MonoBehaviour
{
    void OnGUI()
    {
        string[] names = QualitySettings.names;
        GUILayout.BeginVertical();
        for (int i = 0; i < names.Length; i++)
        {
            if (GUILayout.Button(names[i]))
            {
                Debug.Log(names[i]);
                QualitySettings.SetQualityLevel(i, true);
            }
        }
        GUILayout.EndVertical();
    }
}