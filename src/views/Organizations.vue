<template>
  <div>
    
    <br>
      <v-select
        v-model="pilihOrgs"
        :items="jenisOrgs"
        :rules="[v => !!v || 'Item is required']"
        label="Choose Orgs"
        @change="refetchData"
        required
      ></v-select>
    <br>
    <div 
      v-if="$apollo.queries.organization.loading"
      class="text-center"
    >
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>

    <v-card v-else>
      <v-card-title>
        Organization
        <v-spacer></v-spacer>
        Total Count {{ organization.membersWithRole.totalCount  }}
        <v-spacer></v-spacer>
        <v-btn
          v-if="organization.membersWithRole.pageInfo.hasNextPage"
          @click="showMore"
        >
          Load More
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="organization.membersWithRole.edges"
        :search="search"
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { mapActions } from 'vuex'

export default {
  apollo: {
    organization: {
      query: gql`query ($cursor: String, $orgs: String!) {
        organization(login: $orgs) {
          membersWithRole(after: $cursor, first: 100) {
            totalCount
            edges {
              hasTwoFactorEnabled 
              cursor
              role
              node {
                login
                name
                email
                organizationVerifiedDomainEmails(login: $orgs)
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }`,
      // Initial variables
      variables() {
        return {
          orgs: this.pilihOrgs,
        }
      },

      error (error) {
        this.setAlert({
          status : true,
          color  : 'error',
          text  : error,
        })
      },
    }
  },
  data() {
    return {
      organization: [],

      pilihOrgs: 'sepulsa',
      jenisOrgs: [
        'sepulsa',
        'bimasaktialterra',
      ],

      search: '',
      headers: [
        {
          text: 'Login',
          align: 'start',
          sortable: false,
          value: 'node.login',
        },
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'node.name',
        },
        {
          text: 'E-Mail Public',
          align: 'start',
          sortable: false,
          value: 'node.email',
        },
        {
          text: 'E-Mail Orgs',
          align: 'start',
          sortable: false,
          value: 'node.organizationVerifiedDomainEmails',
        },
        {
          text: 'Role',
          align: 'start',
          sortable: false,
          value: 'role',
        },
        {
          text: '2FA',
          align: 'start',
          sortable: false,
          value: 'hasTwoFactorEnabled',
        },
      ],

    }
  },
  computed: {
    // ...mapGetters({
    //   user: 'auth/user',
    // }),
  },
  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
    }),

    showMore() {
       this.$apollo.queries.organization.fetchMore({
        //  New Variables
        variables: {
          cursor: this.organization.membersWithRole.pageInfo.endCursor,
        },

        // Update Query
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newOrgsMembers = fetchMoreResult.organization.membersWithRole
          const newOrgsMembersEdge = fetchMoreResult.organization.membersWithRole.edges

          return {
            organization: {
              __typename: previousResult.organization.__typename,
              // Merging the tag list
              membersWithRole: {
                ...previousResult.organization.membersWithRole,
                ...newOrgsMembers,
                edges: [
                  ...previousResult.organization.membersWithRole.edges,
                  ...newOrgsMembersEdge
                ]
              }
            },
          }
        }

       })
    },

    refetchData() {
      this.$apollo.queries.organization.refetch()
    }
  }

}
</script>

<style>

</style>