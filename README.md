# `@oxenode/cli`

Oxenode's cli lets you to create an Oxenode plugin project with all the tools required for development.
You can find a documentation article on [creating your plugin](https://oxenode.io/docs/Create-a-plugin/) on the official site.

## Installation

Install the cli as a global package

```
npm i -g @oxenode/cli
```

<br/>

## Create plugins & nodes

Create `MyPlugin`, you can also create `MyNode` from the root of the plugin

```
oxenode plugin MyPlugin

cd MyPlugin

oxenode node MyNode
```

<br/>

## Presets & Examples

You can also start from a Node preset:

```sh
# Will create ./src/MyStateNode.tsx with an example on State
oxenode node MyStateNode state

# Will create ./src/MyOutputNode.tsx with an example on Outputing data
oxenode node MyOutputNode output

# Will create ./src/MyInputNode.tsx with an example on Inputing data
oxenode node MyInputNode input
```

## Develop

You can start a hotreload development server

```
npm run dev
```

## Build

You can then build for production in the root of your project

```
npm run build
```

Compiled source is found in `./dist`

<br/>



<br/>



