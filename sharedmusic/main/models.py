import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):

    def __str__(self):
        return self.username


class Soundtrack(models.Model):
    name = models.CharField(default="Soundtrack", max_length=120, verbose_name="Name")
    url = models.URLField(max_length=2000, verbose_name="URL")
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Creation date")

    class Meta:
        verbose_name_plural = 'Soundtracks'
        verbose_name = 'Soundtrack'
        ordering = ['-id']


class Playlist(models.Model):
    name = models.CharField(default="Playlist", max_length=120, verbose_name="Name")
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Creation date")

    def __str__(self):
        return f"{self.name} ({self.id})"

    class Meta:
        verbose_name_plural = 'Playlists'
        verbose_name = 'Playlist'
        ordering = ['-id']


class PlaylistTrack(models.Model):
    """
    Represents track in current playlist.
    """
    track = models.ForeignKey(Soundtrack, on_delete=models.CASCADE, verbose_name="Soundtrack")
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='tracks', verbose_name="Playlist")

    class Meta:
        verbose_name_plural = 'Playlist tracks'
        verbose_name = 'Playlist track'
        ordering = ['-id']


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="host", verbose_name="Host")
    listeners = models.ManyToManyField(get_user_model(), blank=True, related_name="listeners", verbose_name="Listeners")
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Creation date")
    last_visited = models.DateTimeField(auto_now=True, verbose_name="Last visited")
    playlist = models.OneToOneField(Playlist, null=True, blank=True, on_delete=models.CASCADE, verbose_name="Playlist")

    class Meta:
        verbose_name_plural = "Rooms"
        verbose_name = "Room"
        ordering = ["-id"]
