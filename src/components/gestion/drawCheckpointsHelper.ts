// Helper to draw checkpoints on a Mapbox map
import mapboxgl from 'mapbox-gl';

export function drawCheckpoints(map: mapboxgl.Map, checkpointsData: any[]) {
  if (!map) return;

  // Remove existing checkpoint layers
  checkpointsData.forEach(checkpoint => {
    const circleLayerId = `checkpoint-circle-${checkpoint.id}`;
    const fillLayerId = `checkpoint-fill-${checkpoint.id}`;
    const outlineLayerId = `checkpoint-outline-${checkpoint.id}`;
    const labelLayerId = `checkpoint-label-${checkpoint.id}`;
    
    if (map.getLayer(circleLayerId)) map.removeLayer(circleLayerId);
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
    if (map.getLayer(labelLayerId)) map.removeLayer(labelLayerId);
    if (map.getSource(`checkpoint-${checkpoint.id}`)) {
      map.removeSource(`checkpoint-${checkpoint.id}`);
    }
  });

  // Draw each checkpoint
  checkpointsData.forEach(checkpoint => {
    const sourceId = `checkpoint-${checkpoint.id}`;
    
    if (checkpoint.geometry_type === 'circle') {
      // Draw circular checkpoint
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: checkpoint.name,
            id: checkpoint.id,
            radius: checkpoint.radius_m
          },
          geometry: {
            type: 'Point',
            coordinates: [checkpoint.lng, checkpoint.lat]
          }
        }
      });

      // Add circle layer
      map.addLayer({
        id: `checkpoint-circle-${checkpoint.id}`,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, checkpoint.radius_m * 0.3] // Scale with zoom
            ],
            base: 2
          },
          'circle-color': '#10b981',
          'circle-opacity': 0.2,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#059669',
          'circle-stroke-opacity': 0.8
        }
      });

      // Add label
      map.addLayer({
        id: `checkpoint-label-${checkpoint.id}`,
        type: 'symbol',
        source: sourceId,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-offset': [0, -1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#065f46',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      });

      // Add click handler
      map.on('click', `checkpoint-circle-${checkpoint.id}`, (e) => {
        new mapboxgl.Popup()
          .setLngLat([checkpoint.lng, checkpoint.lat])
          .setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-lg">${checkpoint.name}</h3>
              <p class="text-sm text-gray-600">Checkpoint Circular</p>
              <p class="text-xs mt-2">Radio: ${checkpoint.radius_m}m</p>
              <p class="text-xs">Coordenadas: ${checkpoint.lat.toFixed(4)}, ${checkpoint.lng.toFixed(4)}</p>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor on hover
      map.on('mouseenter', `checkpoint-circle-${checkpoint.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', `checkpoint-circle-${checkpoint.id}`, () => {
        map.getCanvas().style.cursor = '';
      });

    } else if (checkpoint.geometry_type === 'polygon') {
      // Draw polygonal checkpoint
      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: checkpoint.name,
            id: checkpoint.id
          },
          geometry: checkpoint.polygon
        }
      });

      // Add fill layer
      map.addLayer({
        id: `checkpoint-fill-${checkpoint.id}`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.15
        }
      });

      // Add outline layer
      map.addLayer({
        id: `checkpoint-outline-${checkpoint.id}`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#059669',
          'line-width': 2,
          'line-opacity': 0.8
        }
      });

      // Calculate center for label
      const coordinates = checkpoint.polygon.coordinates[0];
      const centerLng = coordinates.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coordinates.length;
      const centerLat = coordinates.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coordinates.length;

      // Add label source and layer
      map.addSource(`checkpoint-label-${checkpoint.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: checkpoint.name },
          geometry: {
            type: 'Point',
            coordinates: [centerLng, centerLat]
          }
        }
      });

      map.addLayer({
        id: `checkpoint-label-${checkpoint.id}`,
        type: 'symbol',
        source: `checkpoint-label-${checkpoint.id}`,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-offset': [0, 0],
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#065f46',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2
        }
      });

      // Add click handler
      map.on('click', `checkpoint-fill-${checkpoint.id}`, (e) => {
        new mapboxgl.Popup()
          .setLngLat([centerLng, centerLat])
          .setHTML(`
            <div class="p-3">
              <h3 class="font-bold text-lg">${checkpoint.name}</h3>
              <p class="text-sm text-gray-600">Checkpoint Poligonal</p>
              <p class="text-xs mt-2">Área de interés específica</p>
            </div>
          `)
          .addTo(map);
      });

      // Change cursor on hover
      map.on('mouseenter', `checkpoint-fill-${checkpoint.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', `checkpoint-fill-${checkpoint.id}`, () => {
        map.getCanvas().style.cursor = '';
      });
    }
  });
}
