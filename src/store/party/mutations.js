

export const LOAD_PARTIES = (state, parties) => {
    for(var i = 0; i<parties.length; i++) {
        let p = parties[i]
        let party_object  = {
            name: p.name,
            nick_name: p.nick_name
        }
        state.parties[p.id] = party_object
    }
    state.allParties = parties
}

export const UPDATE_PARTY = (state, party) => {
    let party_object  = {
        name: party.name,
        nick_name: party.nick_name
    }
    state.parties[party.id] = party_object
}