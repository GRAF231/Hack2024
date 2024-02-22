using UnityEngine;
using UnityEngine.Tilemaps;
using MoreMountains.TopDownEngine;
using System.Collections;

public class MyTilemapLevelGenerator : TilemapLevelGenerator
{
    [Tooltip("The list of enemy prefabs this level manager will instantiate on Start")]
    public Character[] EnemyPrefabs;
    public float pathNodesMultiple = 4;

    /// <summary>
    /// Generates a new level
    /// </summary>
    public override void Generate()
    {
        base.Generate();
        StartCoroutine(Init());
    }

    IEnumerator Init()
    {
        yield return new WaitForSeconds(.05f);

        GeneratePaths();
        SpawnEnemy();
    }


    protected virtual void SpawnEnemy()
    {
        if (EnemyPrefabs.Length != 0)
        {
            foreach (Character enemyPrefab in EnemyPrefabs)
            {
                Instantiate(enemyPrefab, Exit.transform.position, Quaternion.identity);
            }
        }
    }

    protected virtual void GeneratePaths()
    {
        var graphToScan = AstarPath.active.data.gridGraph;
        Bounds bounds = ObstaclesTilemap.localBounds;
        var width = (int)(bounds.size.x * pathNodesMultiple);
        var depth = (int)(bounds.size.y * pathNodesMultiple);
        graphToScan.SetDimensions(width, depth, 1 / pathNodesMultiple);
        AstarPath.active.Scan(graphToScan);
    }
}
