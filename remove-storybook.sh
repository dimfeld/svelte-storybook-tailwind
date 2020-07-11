#!/bin/bash
# This removes all the storybook files for projects that don't need it.
set -e
set -x
rm -rf storybook*
rm -rf Storybook*
rm -rf .storybook

sed -i '/@storybook\|build-storybook\|stories"\|-loader"/d' package.json
