// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// import { VDataTableServer } from "vuetify/labs/VDataTableServer";
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import { VStepper } from 'vuetify/labs/VStepper'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  components: {
    ...components,
    ...labsComponents,
    VStepper,
  },
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
