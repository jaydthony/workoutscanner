<template>
    <div class="contain">
        <div class="cover">
            <div class="start">
                <div class="left">
                    <h3>Routines</h3>
                    <div class="left-cover">
                        <div class="left-det">
                            <div class="tabs"
                                v-for="workout in routinesWorkout"
                                :key="workout.parts"
                            >
                                <p>{{ workout.parts }}</p>
                                <img :src="require('../assets/arrow-right.png')" alt="">
                            </div>
                        </div>
                        
                        <div class="last">
                            <v-divider></v-divider>
                            <NewRoutines/>
                        </div>

                    </div>
                </div>
                <div class="right">
                    <h3>Exercises</h3>
                    <div class="right-cover">
                        <div class="right-det">
                            <div class="tabs"
                                v-for="exercise in exercisePart"
                                :key="exercise.parts"
                            >
                                <p>{{ exercise.parts }}</p>
                                <img :src="require('../assets/close-square.png')" alt="">
                            </div>
                        </div>
                        
                        <div class="last">
                            <v-divider></v-divider>
                            <div>
                                <v-icon color="rgb(135, 183, 9)" start icon="mdi-plus"></v-icon>
                                Add Exercise
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="end">
                <div class="details">
                    <!-- video player --> 
                    <img class="workout-vid" :src="require('../assets/workoutvid.png')" alt="vid">
                    <!-- video player -->
                    
                    <div class="detail-head">
                        <h3>Calve Lunges</h3>
                        <!-- <img :src="require('../assets/edit-dark.png')" alt="edit"/> -->
                    </div>

                    <h4>Description</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet justo donec enim diam vulputate ut. Nec ultrices dui sapien eget mi. </p>

                    <!-- <v-expansion-panels>
                        <v-expansion-panel
                            title="Description"
                            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima"
                        >
                        </v-expansion-panel>
                    </v-expansion-panels> -->

                    <h4>Additional Information</h4>
                    <p><span>Reps:3 </span> <span> Duration: 10 minutes</span></p>

                    <v-divider></v-divider>
                    <h4>All Exercises -- Leg Workouts</h4>
                    <div class="slider"
                        style="max-width: 800px; max-height: 300px;"
                    >
                        <v-slide-group
                        v-model="model"
                        class="pa-4"
                        selected-class="bg-success"
                        show-arrows
                        height="200px"
                        >
                        <v-slide-group-item
                            v-for="n in 15"
                            :key="n"
                            v-slot="{ toggle, selectedClass }"
                        >
                            <v-img
                            :src="require('../assets/Frame-slider.png')"
                            color="grey-lighten-1"
                            :class="['ma-4', selectedClass]"
                            height="300"
                            width="200"
                            @click="toggle"
                            >
                            </v-img>
                        </v-slide-group-item>
                        </v-slide-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Routine.scss";

.pa-4{
    padding: 0px !important;
}

</style>

<script>
import NewRoutines from '@/components/NewRoutines.vue';

export default {

    data() {
        return {
            routinesWorkout: [
                {
                    parts: "Legs Workouts",
                    // icon: require("../assets/arrow-right.png"),
                },
                {
                    parts: "Core Workouts",
                },
                {
                    parts: "Chest Workouts",
                },
                {
                    parts: "Abs Workouts",
                },
                {
                    parts: "Back Workouts"
                }
            ],

            exercisePart: [
                {
                    parts: "Calve Lunges",
                },
                {
                    parts: "Jumping Jacks",
                },
                {
                    parts: "Knee Stretch",
                },
                {
                    parts: "Squats",
                },
            ],
        }
    },
    components: {NewRoutines}

}

</script>