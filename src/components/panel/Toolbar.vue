<template>
  <q-header>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="$emit('openDrawer')"
        icon="menu"
        aria-label="Menu"
      />

      <q-space />
      <q-tabs v-model="activeTab" shrink stretch>
        <q-route-tab
          v-for="(tab, i) in tabs"
          :key="i"
          :label="tab.label"
          :to="tab.route"
        />
      </q-tabs>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  data: () => ({
    activeTab: "tab1",
    tabs: [
      {
        label: "Home",
        route: "/"
      },
      {
        label: "Tab 2",
        route: "/tab2"
      },
      {
        label: "Tab 3",
        route: "/tab3"
      }
    ]
  })
};
</script>

<style></style>
