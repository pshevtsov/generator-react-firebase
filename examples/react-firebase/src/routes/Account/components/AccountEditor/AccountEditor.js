import React from 'react'
import { useFirebaseApp, useDatabaseObject, useUser } from 'reactfire'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import defaultUserImageUrl from 'static/User.png'
import AccountForm from '../AccountForm'
import styles from './AccountEditor.styles'

const useStyles = makeStyles(styles)

function AccountEditor() {
  const classes = useStyles()
  const firebase = useFirebaseApp()
  const auth = useUser()
  const accountRef = firebase.database().ref(`users/${auth.uid}`)
  const profileSnap = useDatabaseObject(accountRef)
  const profile = profileSnap.snapshot.val()

  function updateAccount(newAccount) {
    return firebase
      .updateProfile(newAccount)
      .then(() => accountRef.update(newAccount))
      .catch(error => {
        console.error('Error updating profile', error.message || error) // eslint-disable-line no-console
        return Promise.reject(error)
      })
  }

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12} md={6} lg={6} className={classes.gridItem}>
        <img
          className={classes.avatarCurrent}
          src={profile.avatarUrl || defaultUserImageUrl}
          alt=""
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6} className={classes.gridItem}>
        <AccountForm onSubmit={updateAccount} account={profile} />
      </Grid>
    </Grid>
  )
}

export default AccountEditor
