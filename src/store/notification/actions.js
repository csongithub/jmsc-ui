import NotificationService from "src/services/NotificationService"

export function all({commit, state}, payload) {
    NotificationService.reload(payload.client_id).then(response => {
        if(response.length > 0)
            commit('NOTIFICATIONS', response)
        else
        commit('NOTIFICATIONS', [])
        return state.notifications
    }).catch(err => console.log('get party error in loading notifications: ' + err))
}