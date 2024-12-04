# Zag for LWC

Zag is a collection of open source "Finite state machines for accessible JavaScript components".

[Zag Documentation on GitHub](https://github.com/chakra-ui/zag)

This repo is a subset of Zag components wrapped for LWC.

## Usage

Copy the desired components.

(All components require `zagMixin` and `zagStyles` as dependencies.)

## Components

Version info is documented in the component's `zag.js` file.

## Note on Styles

Component attributes like `[data-part]` have been converted to css ::parts.

# Development Guide

- add `@zag-js/*` component to `package.json`
- add component to `bundle-script.mjs`
- run script to compile: `node bundle-script.mjs`
- create new LWC
- copy zag component code from `/dist` to a `zag.js` file in new lwc folder
