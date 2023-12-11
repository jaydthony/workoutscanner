<template>
    <div class="contain">
        <div class="cover">
            <div class="days">
                <div class="left">
                    <div class="tabs" 
                        v-for="day in daysRoutine"
                        :key="day.days"
                    >
                        <h4>{{ day.days }}</h4>
                        <p>{{ day.status }}</p>
                    </div>
                </div>
                <div class="right">
                    <h3>Routines</h3>
                    <div class="chips"
                        v-for="chip in routines"
                        :key="chip.title"
                    >
                        <div class="chip-cover">
                            <h4>{{ chip.title }}</h4> 
                        </div>
                        <div class="chip-icons">
                            <v-img :src="chip.icon1" contain height="20"/>
                            <v-img :src="chip.icon2" contain height="20"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="details">
                <!-- video player --> 
                <img class="workout-vid" :src="require('../assets/workoutvid.png')" alt="vid">
                <!-- video player -->
                
                <div class="detail-head">
                    <h3>Calve Lunges</h3>
                    <img :src="require('../assets/edit-dark.png')" alt="edit"/>
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
</template>

<style lang="scss" scoped>
@import "../scss/ContentDetail.scss";
.pa-4{
    padding: 0px !important;
}

.ma-4{
    margin: 8px !important;
}

</style>


<script>
export default {
    name: "ContentDetail",

    data() {
        return {
            daysRoutine: [
                {
                    days: "Monday",
                    status: "Routine added",
                },
                {
                    days: "Tuesday",
                    status: "No routine added",
                },
                {
                    days: "Wednesday",
                    status: "No routine added",
                },
                {
                    days: "Thursday",
                    status: "No routine added",
                },
                {
                    days: "Friday",
                    status: "No routine added",
                },
                {
                    days: "Saturday",
                    status: "No routine added",
                },
            ],

            routines: [
                {
                    title: "Leg Workouts",
                    icon1: require("../assets/edit-2.png"),
                    icon2: require("../assets/close-square.png"),
                },
                {
                    title: "Core Workouts",
                    icon1: require("../assets/edit-2.png"),
                    icon2: require("../assets/tick-square.png"),
                },
                {
                    title: "Chest Workouts",
                    icon1: require("../assets/edit-2.png"),
                    icon2: require("../assets/tick-square.png"),
                },
            ]

        }
    }
    
}
</script>