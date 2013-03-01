# Coffee Physics Kaleidoscope

===========================
Pretty mobile/touch device enabled experiment.


Canvas + Javascript kaleidoscope with [Coffee-Physics](https://github.com/soulwire/Coffee-Physics) and 
pixelation through [Close-Pixelate](https://github.com/desandro/close-pixelate).

## Development

To watch and compile source coffee:

```shell
  cd scripts/source/
  coffee -o ../ --watch --join script.js  --compile index.coffee requestAnimationFrame.coffee renderer.coffee world.coffee controls.coffee
```

To watch and compile SCSS:

```shell
  cd coffee-physics-kaelidoscope/
  compass watch
```