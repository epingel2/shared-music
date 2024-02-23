from django import forms
from main.models import Room, CustomUser
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.crypto import get_random_string



class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ("username", "email",)

class CustomUserGuestCreationForm(forms.ModelForm):
    first_name = forms.CharField(max_length=20, required=True,
                                 help_text="Enter Guest Name.")

    class Meta:
        model = CustomUser
        fields = ("first_name",)

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        return first_name

    def save(self, commit=True):
        user = super().save(commit=False)
        # Automatically generate guest username and password
        random_string = get_random_string(8)  # Length can be adjusted based on requirements
        user.username = f"guest_user_{random_string}"
        user.set_password(random_string)
        user.is_guest = True
        user.email = "" 
        user.first_name = self.cleaned_data.get('first_name')

        if commit:
            user.save()
        return user


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ("username", "email",)


class RoomCreationForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ()
