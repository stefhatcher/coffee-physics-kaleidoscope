# Coffee Physics Kaleidoscope

===========================
Pretty mobile/touch device enabled experiment.


Canvas + Javascript kaleidoscope with [Coffee-Physics](https://github.com/soulwire/Coffee-Physics) and 
pixelation through [Close-Pixelate](https://github.com/desandro/close-pixelate).

## Development

Source lives under /app/. Run the server if editing SCSS.

```shell
  /app/scripts/controls.js    # code related to ui-controls and kaleidoscope states
  /app/scripts/kaleid.js      # physics + some canvas related code
  /app/scripts/renderer.js    # rendering the world at its various states
  
  /app/styles/main.scss       # SASS + COMPASS css. Run yeoman server:app first
```

## Yeoman
### Installation

Try the audit script to see what you need in place:

```shell
  curl -L get.yeoman.io | bash
```

You can follow its guidance or simply walk through the [installation procedure](https://github.com/yeoman/yeoman/wiki/Manual-Install).

*Yeoman requires Node 0.8.x*

### Server Profiles & Build

```shell
  yeoman build:minify    # Build your project, creating an optimized version in a new `dist` directory

  yeoman server:app      # Serves up an intermediate build of your application
  yeoman server:dist     # Serves up a production build, if you've built before
```

For more on Yeoman, checkout [Yeoman on GitHub](https://github.com/yeoman/yeoman).