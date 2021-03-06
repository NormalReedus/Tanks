import Pickup from './Pickups.js'

import store from '@/store'
const { p5 } = store.state

// Import all images dynamically for webpack to bundle:
function importAll(r) {
  return r.keys().map(r);
}
const pickupAssets = importAll(require.context('@/assets/pickups', false, /\.(png|jpe?g|svg)$/));

//* The assets should match their name with the strings in Pickup.pickups

export default function preload() {
	// Runs through all types of pickups in Pickup.pickups, loads their asset, and saves it in the assets-object:
	for (const type of Object.values(Pickup.pickups)) {
		type.forEach(pickup => {

			store.commit('setPickupAsset', {
				name: pickup,
				asset: p5.loadImage(
					// the url-string in pickupAssets that contains "/[pickup].":
					pickupAssets.find(url => url.match('/' + pickup + '.'))
				)
			})
		})
	}
}
