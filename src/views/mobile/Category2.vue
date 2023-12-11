<template>
  <div class="category">
    <div class="category-top"></div>

    <div class="continue">
        <button>
            Continue Workout
            <Icon icon="solar:round-arrow-right-broken" width="24" height="24" />
        </button>
    </div>
    <div class="contain">
        <div class="cover">
            
            <div class="program">
                <div v-for="n in 10" :key="n" class="tabs">
                    <div class="left">
                        <h3>Leg Workouts</h3>
                        <p>0/5 completed</p>
                    </div>
                    <Icon icon="solar:arrow-right-broken" width="30" height="30" />
                </div>
            </div>
        </div>
    
        <div class="cover-other">
            <div class="other">
                <h3>Other Programs</h3>
                <div v-for="n in 2" :key="n" class="tabs">
                    <div class="left">
                        <h3>Leg Workouts</h3>
                        <p>0/5 completed</p>
                    </div>
                    <Icon icon="solar:arrow-right-broken" width="30" height="30" />
                </div>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';

export default {
    components: {
		Icon,
	},
}
</script>
 
<style lang="scss" scoped>
@import '../../scss/colors';
@import '../../scss/mobiles-styles/Category2.scss';
</style>