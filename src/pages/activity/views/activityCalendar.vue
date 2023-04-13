<script>
import { defineComponent, ref, reactive, onMounted, watch, toRefs } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { zhTwLocale } from "@fullcalendar/core/locales-all";
import { INITIAL_EVENTS, createEventId, fetchEvents } from "../src/event-utils";
import axios from "axios";

export default defineComponent({
  components: {
    FullCalendar,
  },
  setup() {
    const currentEvents = ref([]);
    const calendarEvents = ref([]);
    const isInitialLoad = ref(true);
    const memberId = () => {
      return store.getters.getUserID;
    };

    const calendarOptions = reactive({
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      buttonText: {
        today: "今天",
        month: "月",
        week: "周",
        day: "日",
      },
      locale: zhTwLocale,
      initialView: "dayGridMonth",
      initialEvents: calendarEvents.value,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      select: handleDateSelect,
      eventClick: handleEventClick,
      eventsSet: handleEvents,
    });

    async function fetchEvents() {
      try {
        const response = await axios.get(
          `https://localhost:7043/Members/GetMemebetFollowedActivities/${memberId}`,
          {
            withCredentials: true,
          }
        );

        calendarEvents.value = response.data.map((event) => {
          let startTime = new Date(event.activityStartTime);
          let endTime = new Date(event.activityEndTime);
          return {
            id: event.id,
            title: event.activityName,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          };
        });
        console.log("calendarEvents", calendarEvents.value);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    onMounted(async () => {
      await fetchEvents();
      watch(
        calendarEvents.value,
        (newEvents) => {
          calendarOptions.initialEvents = newEvents;
        },
        { immediate: true },
        { deep: true }
      );
      console.log(calendarOptions.initialEvents);
    });

    function handleDateSelect(selectInfo) {
      let title = prompt("請輸入新的活動名稱");
      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay,
        });
      }
    }

    function handleEventClick(clickInfo) {
      if (confirm(`您確定是否要刪除? '${clickInfo.event.title}'`)) {
        clickInfo.event.remove();
      }
    }

    function handleEvents(events) {
      currentEvents.value = events;
    }

    return {
      calendarOptions,
      calendarEvents,
      currentEvents,
      handleDateSelect,
      handleEventClick,
      handleEvents,
      isInitialLoad,
    };
  },
});
</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main">
      <FullCalendar
        class="demo-app-calendar custom-button"
        :options="calendarOptions"
      >
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText.slice(0, 1) }}點</b>
          <b>{{ arg.event.title }}</b>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:root {
  --fc-button: orange;
  --fc-button-primary: orange;
  --fc-pre-button: orange;
}
.demo-app {
  display: flex;
  flex-direction: column;
  width: 60%;
  min-height: 80%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  color: white;
  margin-top: 2rem;

  .demo-app-main {
    flex-grow: 1;
    padding: 3em;
    .demo-app-calendar {
    }
  }
  .all {
  }
}

.fc-content {
  color: white;
}

h2 {
  margin: 0;
  font-size: 16px;
}
ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}
li {
  margin: 1.5em 0;
  padding: 0;
}
b {
  /* used for event dates/times */
  margin-right: 3px;
}
.fc {
  /* the calendar root */
  max-width: 1400px;
  margin: 0 auto;
}
</style>
