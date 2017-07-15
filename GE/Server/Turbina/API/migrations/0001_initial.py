# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-07-15 02:48
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Iteracion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('atmosferap', models.DecimalField(decimal_places=20, max_digits=30)),
                ('atmosferat', models.DecimalField(decimal_places=20, max_digits=30)),
                ('sigmain', models.DecimalField(decimal_places=20, max_digits=30)),
                ('compic', models.DecimalField(decimal_places=20, max_digits=30)),
                ('competa', models.DecimalField(decimal_places=20, max_digits=30)),
                ('combetaburn', models.DecimalField(decimal_places=20, max_digits=30)),
                ('combqn', models.DecimalField(decimal_places=20, max_digits=30)),
                ('combtstagout', models.DecimalField(decimal_places=20, max_digits=30)),
                ('turbineeta', models.DecimalField(decimal_places=20, max_digits=30)),
                ('turbinep', models.DecimalField(decimal_places=20, max_digits=30)),
                ('load', models.DecimalField(decimal_places=20, max_digits=30)),
                ('sigmaout', models.DecimalField(decimal_places=20, max_digits=30)),
                ('regenin', models.DecimalField(decimal_places=20, max_digits=30)),
                ('regenout', models.DecimalField(decimal_places=20, max_digits=30)),
                ('fecha', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='ResultadoIteracion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('load', models.DecimalField(decimal_places=20, max_digits=30)),
                ('compt', models.DecimalField(decimal_places=20, max_digits=30)),
                ('compp', models.DecimalField(decimal_places=20, max_digits=30)),
                ('turbinet', models.DecimalField(decimal_places=20, max_digits=30)),
                ('turbinep', models.DecimalField(decimal_places=20, max_digits=30)),
                ('iteracion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.Iteracion')),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=45)),
                ('password', models.CharField(max_length=45)),
            ],
        ),
        migrations.AddField(
            model_name='iteracion',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.Usuario'),
        ),
    ]