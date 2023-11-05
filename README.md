# `@oxenode/cli`

<br/>

# Create a plugin

Install

```
npm i -g @oxenode/cli
```

<br/>

Create `MyPlugin` and create `MyNode` inside

```
oxenode plugin MyPlugin

cd MyPlugin

oxenode node MyNode
```

<br/>

You can also start from a Node preset:

```sh
# Will create ./src/MyStateNode.tsx with an example on State
oxenode node MyStateNode state

# Will create ./src/MyOutputNode.tsx with an example on Outputing data
oxenode node MyOutputNode output

# Will create ./src/MyInputNode.tsx with an example on Inputing data
oxenode node MyInputNode input
```

You can then build in the root of your project

```
npm run build
```

Compiled source is found in `./dist`

<br/>



<br/>



