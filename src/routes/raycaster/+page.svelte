<script lang="ts">
    import { onMount } from "svelte"
    import { Raycaster } from "$lib/raycaster/raycaster.svelte"
	import { remap } from "$lib/raycaster/math"

    let canvas: HTMLCanvasElement
    let ctx: CanvasRenderingContext2D
    let engine: Raycaster

    let wallTexture: HTMLImageElement

    const map = [
        [1,1,1,1,1,1],
        [1,0,0,0,0,1],
        [1,0,0,0,0,1],
        [1,0,0,1,0,1],
        [1,0,0,0,0,1],
        [1,1,1,1,1,1]
    ]

    async function init() {
        wallTexture = new Image();
        wallTexture.src = "/raycaster/wall.jpg"
        await wallTexture.onload

        ctx = canvas.getContext('2d')!
        engine = new Raycaster(map)
        loop(0)
    }

    let t1 = 0;
    function loop(t0: number) {
        const dt = t0-t1
        t1 = t0
        
        engine.update(dt)

        render()
        requestAnimationFrame(loop)
    }

    function render() {
        // clear the screen!
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const midX = canvas.width / 2
        const midY = canvas.height / 2

        // actual rendering
        for (let x = 0; x < canvas.width; x++) {
            const cameraX = remap(x, 0, canvas.width, -1, 1)

            const result = engine.castRay(cameraX)
            const lineHeight = canvas.height / result.distance;

            // ctx.strokeStyle = '#0f0'
            // ctx.beginPath()
            // ctx.moveTo(x, midY - (lineHeight / 2))
            // ctx.lineTo(x, midY + (lineHeight / 2))
            // ctx.stroke()

            drawTexturedColumn(x, cameraX, lineHeight, result, wallTexture)
        }
    }

    function drawTexturedColumn(x: number, cameraX: number, lineHeight: number, result: any, textureImg: HTMLImageElement) {
        const rd = {
            x: Math.cos(engine.player.dir) + engine.player.planeX * cameraX,
            y: Math.sin(engine.player.dir) + engine.player.planeY * cameraX
        }

        const texWidth = textureImg.width
        const texHeight = textureImg.height

        let texX = Math.floor(result.wallX * texWidth);
        
        if ((result.side === 0 && rd.x > 0) || (result.side === 1 && rd.y < 0)) {
            texX = texWidth - texX - 1;
        }

        // 1px slice
        ctx.drawImage(
            textureImg,
            texX, 0, 1, texHeight,
            x, (canvas.height / 2) - (lineHeight / 2), 1, lineHeight
        );

        // shadow for other side
        if (result.side === 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(x, (canvas.height / 2) - (lineHeight / 2), 1, lineHeight);
        }
    }

    onMount(init)
</script>


<canvas bind:this={canvas} width="640" height="480"></canvas>

<style>
    canvas { background: #000; display: block; margin: 0 auto; }
</style>