<template>
  <div class="section">
    <div class="top">
        <h2>Leg Program - Joshua</h2>
    </div>
    <div class="maincontent">
        <div class="card-cover"
            v-for="item in cards" :key="item.programName"
        >
            <v-card style="padding: 20px; margin-bottom: 10px;">
                <div class="name-cover">
                    <h2>{{ item.programName }}</h2>
                    <Icon icon="iconamoon:arrow-right-2" />
                </div>
                <v-progress-linear model-value="20" style="margin: 10px 0px"></v-progress-linear>
                <p>0/{{ item.total }} Completed</p>
            </v-card>
        </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
export default {
    name: 'Section1',
    components: {
		Icon,
	},
    data() {
        return{
            cards: [
                {
                    programName: 'Gyms',
                    total: 6,
                },
                {
                    programName: 'Brains Workout',
                    total:8,
                },
                {
                    programName: 'WorkoutByJames',
                    total: 4,
                },
                {
                    programName: 'Maliya',
                    total: 3,
                },
                {
                    programName: 'Gyms',
                    total: 6,
                },
                {
                    programName: 'Gyms',
                    total: 6,
                },
                {
                    programName: 'Gyms',
                    total: 6,
                },
            ],
        }
    },

}
</script>

<style lang="scss" scoped>
@import '../../scss/mobiles-styles/Section.scss';

</style>