# This script facilitates the manual post-install step of setting up the abra_wasm package.
# This needs to be done manually, since we can't rely on `cargo` and `wasm-pack` to be installed
# everywhere; this will build the abra_wasm package within the abra-lang git submodule, copy it
# out into the top-level directory, and install it as an npm dependency.
#
# Before installing as an npm dependency though, something dumb and annoying needs to happen.
# There's a line in the generated glue code that relies on a future js language feature (the
# import.meta feature); due to the fact that we're in create-react-app land (and for some reason
# the rescripts babel rewrite which would enable the import-meta syntax didn't seem to work...)
# this line will cause problems at build-time. Since we don't use that particular code path, we
# can comment out that line using a wonderfully hacky sed command (I know, this is _stupid_).
#
# Also due to the inability to customize babel configs from within CRA, loading wasm files needs to
# be done in a weird way. It won't be bundled with the app (as one would expect), but instead served
# up with the static assets, and then referenced in the `init` function that the glue code provides.
# This means that the compiled wasm file needs to be placed in the public/ directory, so at dev- and
# build-time, it'll be available to serve statically.

# pwd = root
git clone git@github.com:kengorab/abra-lang.git
cd abra-lang
cargo build
cd abra_wasm
WASM_PACK_TARGET=web ./build.sh
cp -R pkg ../../abra_wasm

# pwd = root again
cd ../..
rm abra_wasm/.gitignore
sed 's/^.*import\.meta/\/\/&/' abra_wasm/abra_wasm.js > abra_wasm/abra_wasm_.js
mv abra_wasm/abra_wasm_.js abra_wasm/abra_wasm.js

# The init function type declaration needs to be added manually, for the WASM_PACK_TARGET=web target
echo "\nexport default function init(moduleName: string): Promise<any>;" >> abra_wasm/abra_wasm.d.ts
npm i ./abra_wasm

cp abra_wasm/abra_wasm_bg.wasm public/abra_wasm/abra_wasm_bg.wasm

rm -rf abra-lang
