<script lang="ts">
  import { districts } from "@/districts";
  export let district: string;
 
  const selected = districts.find(d => d.name === district);

  // Function to parse SVG path and calculate bounding box
  function calculateBoundingBox(pathData: string) {
    const allPoints: {x: number, y: number}[] = [];
    let currentX = 0;
    let currentY = 0;
    
    // Split into commands
    const commands = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
    
    commands.forEach(command => {
      const cmd = command[0];
      const coords = command.slice(1).match(/-?\d*\.?\d+/g) || [];
      const numbers = coords.map(n => parseFloat(n));
      
      switch (cmd.toLowerCase()) {
        case 'm': // Move to
          if (numbers.length >= 2) {
            if (cmd === 'M') {
              // Absolute move
              currentX = numbers[0];
              currentY = numbers[1];
            } else {
              // Relative move
              currentX += numbers[0];
              currentY += numbers[1];
            }
            allPoints.push({x: currentX, y: currentY});
            
            // Handle additional coordinate pairs as line-to commands
            for (let i = 2; i < numbers.length; i += 2) {
              if (i + 1 < numbers.length) {
                if (cmd === 'M') {
                  currentX = numbers[i];
                  currentY = numbers[i + 1];
                } else {
                  currentX += numbers[i];
                  currentY += numbers[i + 1];
                }
                allPoints.push({x: currentX, y: currentY});
              }
            }
          }
          break;
        case 'l': // Line to
          for (let i = 0; i < numbers.length; i += 2) {
            if (i + 1 < numbers.length) {
              if (cmd === 'L') {
                currentX = numbers[i];
                currentY = numbers[i + 1];
              } else {
                currentX += numbers[i];
                currentY += numbers[i + 1];
              }
              allPoints.push({x: currentX, y: currentY});
            }
          }
          break;
        case 'h': // Horizontal line
          numbers.forEach(dx => {
            if (cmd === 'H') {
              currentX = dx;
            } else {
              currentX += dx;
            }
            allPoints.push({x: currentX, y: currentY});
          });
          break;
        case 'v': // Vertical line
          numbers.forEach(dy => {
            if (cmd === 'V') {
              currentY = dy;
            } else {
              currentY += dy;
            }
            allPoints.push({x: currentX, y: currentY});
          });
          break;
      }
    });
    
    if (allPoints.length === 0) return { minX: 0, minY: 0, maxX: 200, maxY: 200 };
    
    const xCoords = allPoints.map(p => p.x);
    const yCoords = allPoints.map(p => p.y);
    
    return {
      minX: Math.min(...xCoords),
      minY: Math.min(...yCoords),
      maxX: Math.max(...xCoords),
      maxY: Math.max(...yCoords)
    };
  }

  // Calculate viewBox for the selected district
  function getViewBox(pathData: string) {
    const bbox = calculateBoundingBox(pathData);
    const width = bbox.maxX - bbox.minX;
    const height = bbox.maxY - bbox.minY;
    
    // Much smaller padding for better zoom
    const padding = Math.max(width, height) * 0.01; // Only 1% padding
    
	
    // Calculate center point
    const centerX = (bbox.minX + bbox.maxX) / 2;
    const centerY = (bbox.minY + bbox.maxY) / 2;
    
    // Create a square viewBox centered on the district
    const maxDimension = Math.max(width, height) + (2 * padding);
    const halfDimension = maxDimension / 2;
    
    return `${centerX - halfDimension} ${centerY - halfDimension} ${maxDimension} ${maxDimension}`;
  }

  $: viewBox = selected ? getViewBox(selected.d) : "0 0 200 200";
</script>


    {#if selected}
		
		<div class="w-[150px] h-[150px]">
		<svg viewBox={viewBox}  class="w-full h-full">
			<path
			d={selected.d}
			name={selected.name}
			id={selected.id}
			fill="#2c3e50"
			stroke="#fff"
			stroke-width="2"
			vector-effect="non-scaling-stroke"
		/>
		</svg>
		</div>
      
    {:else}
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999">
        District not found
      </text>
    {/if}
