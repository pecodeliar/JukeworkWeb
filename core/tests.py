from django.test import TestCase
from django.test import TestCase, Client
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from users.models import User

# Create your tests here.
class BackendTestCase(TestCase):

     def setUp(self):
          # Make the base user
          self.user = User.objects.create(username='testuser')
          self.user.set_password('12345')
          self.user.save()
          # Log in
          self.client = Client()
          self.client.login(username='testuser', password='12345')


    def test_emotion_duplicate(self):
          """User should receive an error message stating that the emotion has already been created."""

          with self.assertRaises(IntegrityError):
               test1 = Emotion.objects.create(creator=self.user, name="Spartan Rage")
               test2 = Emotion.objects.create(creator=self.user, name="Spartan Rage")
               test1.save()
               test2.save()


     def test_symptom_duplicate(self):
          """User should receive an error message stating that the symptom has already been created."""

          with self.assertRaises(IntegrityError):
               test1 = Symptom.objects.create(creator=self.user, name="Solar Hands", level=0)
               test2 = Symptom.objects.create(creator=self.user, name="Solar Hands", level=0)
               test1.save()
               test2.save()


     def test_activity_duplicate(self):
          """User should receive an error message stating that the activity has already been created."""

          with self.assertRaises(IntegrityError):
               test1 = Activity.objects.create(creator=self.user, name="Purposedly ruined lunch.")
               test2 = Activity.objects.create(creator=self.user, name="Purposedly ruined lunch.")
               test1.save()
               test2.save()


     def test_symptom_level_selection(self):
          """Make sure that a non-choice level does not get added to the database."""

          with self.assertRaises(InvalidActionError):
               test1 = Symptom.objects.create(creator=self.user, name="The Suds", level=5)
               test1.save()
          with self.assertRaises(InvalidActionError):
               test2 = Symptom.objects.create(creator=self.user, name="Rustlung", level="Lambency")
               test2.save()


     def test_ok_settings_page_access(self):
          """If user is logged in, they should be able to see their symptoms page."""
          response = self.client.get(f"/settings")

          self.assertEqual(response.status_code, 200)


     def test_ok_following_page_access(self):
          """If user is logged in, they should be able to see their following page."""
          response = self.client.get(f"/following")

          self.assertEqual(response.status_code, 200)


     def test_redirect_settings_page(self):
          """The settings page should only be available to users who are signed in."""
          self.client.logout()
          response = self.client.get(f"/settings")

          self.assertEqual(response.status_code, 302)


     def test_redirect_following_page(self):
          """The following page should only be available to users who are signed in."""
          response = self.client.get(f"/following")

          self.assertEqual(response.status_code, 302)