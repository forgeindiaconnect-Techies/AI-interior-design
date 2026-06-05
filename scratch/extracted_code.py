# --- Cell 2 ---
import argparse
import os
import random
import torch
import torch.nn as nn
import torch.nn.parallel
import torch.optim as optim
import torch.utils.data
import torchvision.datasets as dset
import torchvision.transforms as transforms
import torchvision.utils as vutils
from PIL import Image

import numpy as np
from torch.utils.data import Dataset, DataLoader

import matplotlib.pyplot as plt
import matplotlib.animation as animation
from IPython.display import HTML

# --- Cell 4 ---
manualSeed = 42
print("Random Seed: ", manualSeed)
random.seed(manualSeed)
torch.manual_seed(manualSeed)
torch.use_deterministic_algorithms(False)

# --- Cell 5 ---
dataset_path = '/kaggle/input/modern-architecture-100k-small-images/Dataset_128px_128px_Images/Appartments'


# --- Cell 8 ---
class CustomImageDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        # Filter to only include images with 'interior' in their filename
        keywords = ['interior', 'room','stairs','chair','sofa','sink']
        self.image_files = [
            f for f in os.listdir(root_dir)
            if any(keyword in f.lower() for keyword in keywords) and f.endswith(('.png', '.jpg', '.jpeg'))
        ]
    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx):
        img_name = os.path.join(self.root_dir, self.image_files[idx])
        image = Image.open(img_name)

        if self.transform:
            image = self.transform(image)

        return image

# --- Cell 9 ---
def show_images(images, num_images=8):
    # Set up the figure
    plt.figure(figsize=(10, 10))
    
    # Adjust the number of rows and columns based on the number of images
    num_cols = 4
    num_rows = num_images // num_cols + (num_images % num_cols > 0)

    for i in range(num_images):
        plt.subplot(num_rows, num_cols, i + 1)
        plt.imshow(images[i].permute(1, 2, 0),cmap='gray')  # Change from (C, H, W) to (H, W, C)
        plt.axis('off')  # Hide axes

    plt.show()


# --- Cell 11 ---

transform = transforms.Compose([
    transforms.Resize((64, 64), interpolation=Image.LANCZOS),  # High-quality interpolation
    transforms.Grayscale(num_output_channels=1),  # Convert to grayscale
    transforms.ToTensor(),  # Convert images to PyTorch tensors
    transforms.Normalize(mean=[0.5], std=[0.5]),  # Normalize
])

# --- Cell 12 ---
image_dataset = CustomImageDataset(root_dir=dataset_path, transform=transform)

# Create a DataLoader
data_loader = DataLoader(image_dataset, batch_size=128, shuffle=True)  # Adjust batch size as needed

# --- Cell 13 ---
for images in data_loader:
    show_images(images, num_images=16)
    break

# --- Cell 14 ---
total_images = len(image_dataset)
print(f'Total number of images in the dataset: {total_images}')


# --- Cell 16 ---
device = torch.device("cuda:0" if (torch.cuda.is_available() and ngpu > 0) else "cpu")

# --- Cell 19 ---
def weights_init(m):
    classname = m.__class__.__name__
    if classname.find('Conv') != -1:
        nn.init.normal_(m.weight.data, 0.0, 0.02)
    elif classname.find('BatchNorm') != -1:
        nn.init.normal_(m.weight.data, 1.0, 0.02)
        nn.init.constant_(m.bias.data, 0)

# --- Cell 21 ---
import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, nz, ngf, nc):
        """
        Args:
        nz: Size of the latent vector (input noise)
        ngf: Number of feature maps in generator
        nc: Number of output channels (3 for RGB images, 1 for grayscale)
        """
        super(Generator, self).__init__()
        
        self.main = nn.Sequential(
            # First layer: latent vector to (ngf * 8) x 4 x 4
            nn.ConvTranspose2d(nz, ngf * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf * 8),
            nn.ReLU(True),
            
            # Second layer: (ngf * 8) x 4 x 4 -> (ngf * 4) x 8 x 8
            nn.ConvTranspose2d(ngf * 8, ngf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 4),
            nn.ReLU(True),
            
            # Third layer: (ngf * 4) x 8 x 8 -> (ngf * 2) x 16 x 16
            nn.ConvTranspose2d(ngf * 4, ngf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 2),
            nn.ReLU(True),
            
            # Fourth layer: (ngf * 2) x 16 x 16 -> (ngf) x 32 x 32
            nn.ConvTranspose2d(ngf * 2, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf),
            nn.ReLU(True),
            
            # Output layer: (ngf) x 32 x 32 -> (nc) x 64 x 64
            nn.ConvTranspose2d(ngf, nc, 4, 2, 1, bias=False),
            nn.Tanh()  # Output in range [-1, 1] for normalized image values
        )
    
    def forward(self, input):
        return self.main(input)

nz = 100  # Latent vector size
ngf = 64  # Number of generator feature maps
nc = 1    # Number of output channels (3 for RGB images)

# Create generator instance and apply weights initialization
netG = Generator(nz, ngf, nc).to(device)
netG.apply(weights_init)


# --- Cell 23 ---
import torch.nn as nn

class Discriminator(nn.Module):
    def __init__(self, nc, ndf):
        """
        Args:
        nc: Number of input channels (3 for RGB images, 1 for grayscale)
        ndf: Number of feature maps in discriminator
        """
        super(Discriminator, self).__init__()

        self.main = nn.Sequential(
            # First layer: (nc) x 64 x 64 -> (ndf) x 32 x 32
            nn.Conv2d(nc, ndf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),

            # Second layer: (ndf) x 32 x 32 -> (ndf * 2) x 16 x 16
            nn.Conv2d(ndf, ndf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 2),
            nn.LeakyReLU(0.2, inplace=True),

            # Third layer: (ndf * 2) x 16 x 16 -> (ndf * 4) x 8 x 8
            nn.Conv2d(ndf * 2, ndf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 4),
            nn.LeakyReLU(0.2, inplace=True),

            # Fourth layer: (ndf * 4) x 8 x 8 -> (ndf * 8) x 4 x 4
            nn.Conv2d(ndf * 4, ndf * 8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 8),
            nn.LeakyReLU(0.2, inplace=True),

            # Output layer: (ndf * 8) x 4 x 4 -> 1 x 1 x 1 (scalar)
            nn.Conv2d(ndf * 8, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()  # Output probability between [0, 1]
        )

    def forward(self, input):
        return self.main(input)

nc = 1    # Number of input channels (3 for RGB images)
ndf = 64  # Number of discriminator feature maps

netD = Discriminator(nc, ndf).to(device)
netD.apply(weights_init)


# --- Cell 25 ---
criterion = nn.BCELoss()

# Establish convention for real and fake labels during training
real_label = 1.
fake_label = 0.

lr = 0.0002
beta1 = 0.5
# Setup Adam optimizers for both G and D
optimizerD = optim.Adam(netD.parameters(), lr=lr, betas=(beta1, 0.999))
optimizerG = optim.Adam(netG.parameters(), lr=lr, betas=(beta1, 0.999))

# --- Cell 27 ---
!pip install wandb

# --- Cell 28 ---
import wandb
wandb.init(project='dcgan-architecture')

# --- Cell 29 ---
def log_generated_images(generator, epoch, num_images=16):
    # Create batch of latent vectors
    latent_vectors = torch.randn(num_images, latent_dim, 1, 1).to(device)  # Adjust shape if necessary
    generated_images = generator(latent_vectors)
    
    # Convert to numpy and unnormalize
    generated_images = generated_images.detach().cpu().numpy()
    generated_images = (generated_images + 1) / 2  # Rescale from [-1, 1] to [0, 1]
    
    # Log images to WandB
    wandb.log({f'generated_images_epoch_{epoch}': [wandb.Image(img) for img in generated_images]})

# --- Cell 31 ---
import torch.optim as optim

# Number of training epochs
num_epochs = 50

# Latent vector size
latent_dim = 100

# Training loop
for epoch in range(num_epochs):
    for i, data in enumerate(data_loader, 0):
        ############################
        # (1) Update D network: maximize log(D(x)) + log(1 - D(G(z)))
        ###########################
        ## Train with real batch
        netD.zero_grad()
        real_data = data.to(device)
        b_size = real_data.size(0)
        label = torch.full((b_size,), real_label, dtype=torch.float, device=device)
        
        # Forward pass real batch through D
        output = netD(real_data).view(-1)
        errD_real = criterion(output, label)
        errD_real.backward()
        D_x = output.mean().item()

        ## Train with fake batch
        noise = torch.randn(b_size, latent_dim, 1, 1, device=device)
        fake = netG(noise)
        label.fill_(fake_label)

        # Forward pass fake batch through D
        output = netD(fake.detach()).view(-1)
        errD_fake = criterion(output, label)
        errD_fake.backward()
        D_G_z1 = output.mean().item()
        errD = errD_real + errD_fake
        optimizerD.step()

        ############################
        # (2) Update G network: maximize log(D(G(z)))
        ###########################
        netG.zero_grad()
        label.fill_(real_label)  # Real label for generator loss

        # Since we just updated D, perform another forward pass of all-fake batch through D
        output = netD(fake).view(-1)
        errG = criterion(output, label)
        errG.backward()
        D_G_z2 = output.mean().item()
        optimizerG.step()

        # Output training stats
        if i % 50 == 0:
            print(f'[{epoch}/{num_epochs}] [{i}/{len(data_loader)}] '
                  f'Loss_D: {errD.item():.4f} Loss_G: {errG.item():.4f} '
                  f'D(x): {D_x:.4f} D(G(z)): {D_G_z1:.4f} / {D_G_z2:.4f}')

        # Log the losses to wandb
        wandb.log({"Loss_D": errD.item(), "Loss_G": errG.item(), "D(x)": D_x, "D(G(z1))": D_G_z1, "D(G(z2))": D_G_z2})
    
    # Log generated images to wandb after every epoch
    log_generated_images(netG, epoch, num_images=16)

    # Save the model checkpoints
    torch.save(netG.state_dict(), f"netG_epoch_{epoch}.pth")
    torch.save(netD.state_dict(), f"netD_epoch_{epoch}.pth")

print("Training finished.")

# --- Cell 35 ---
nc = 1
nz = 100
ngf = 64
ndf = 64
num_epochs = 50
lr = 0.0002
beta1 = 0.5
ngpu = 1

# --- Cell 36 ---
for images in data_loader:
    show_images(images, num_images=16)
    break

# --- Cell 37 ---
class Generator(nn.Module):
    def __init__(self, ngpu):
        super(Generator, self).__init__()
        self.ngpu = ngpu
        self.main = nn.Sequential(
            # nz is input noise, ngf*8 number of feature maps and we use kernel size of 4
            # 1x1
            nn.ConvTranspose2d( nz, ngf * 8, 4, 1, 0, bias=False),
            nn.BatchNorm2d(ngf * 8),
            nn.ReLU(True),
            #4x4
            nn.ConvTranspose2d(ngf * 8, ngf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 4),
            nn.ReLU(True),
            #16x16
            nn.ConvTranspose2d( ngf * 4, ngf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf * 2),
            nn.ReLU(True),
            #32x32
            nn.ConvTranspose2d( ngf * 2, ngf, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ngf),
            nn.ReLU(True),
            #64x64
            nn.ConvTranspose2d( ngf, nc, 4, 2, 1, bias=False),
            nn.Tanh()
            
        )

    def forward(self, input):
        return self.main(input)

# --- Cell 38 ---
ngpu = 1
netG = Generator(ngpu).to(device)
netG.apply(weights_init)
print(netG)

# --- Cell 39 ---
class Discriminator(nn.Module):
    def __init__(self, ngpu):
        super(Discriminator, self).__init__()
        self.ngpu = ngpu
        self.main = nn.Sequential(
            
            nn.Conv2d(nc, ndf, 4, 2, 1, bias=False),
            nn.LeakyReLU(0.2, inplace=True),
            
            nn.Conv2d(ndf, ndf * 2, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 2),
            nn.LeakyReLU(0.2, inplace=True),
            
            nn.Conv2d(ndf * 2, ndf * 4, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 4),
            nn.LeakyReLU(0.2, inplace=True),
            
            nn.Conv2d(ndf * 4, ndf * 8, 4, 2, 1, bias=False),
            nn.BatchNorm2d(ndf * 8),
            nn.LeakyReLU(0.2, inplace=True),
            
            nn.Conv2d(ndf * 8, 1, 4, 1, 0, bias=False),
            nn.Sigmoid()
        )

    def forward(self, input):
        return self.main(input)

# --- Cell 40 ---
netD = Discriminator(ngpu).to(device)
netD.apply(weights_init)
print(netD)

# --- Cell 42 ---
criterion = nn.BCELoss()

fixed_noise = torch.randn(64, nz, 1, 1, device=device)

real_label = 1
fake_label = 0

optimizerD = optim.Adam(netD.parameters(), lr=lr, betas=(beta1, 0.999))
optimizerG = optim.Adam(netG.parameters(), lr=lr, betas=(beta1, 0.999))

# --- Cell 43 ---
wandb.init(project='dcgan-architecture-v2')

# --- Cell 44 ---
img_list = []
G_losses = []
D_losses = []
iters = 0

print("Starting Training Loop...")
# For each epoch
for epoch in range(num_epochs):
    for i, data in enumerate(data_loader, 0):
        # Check if images are grayscale and reshape accordingly
        real_cpu = data[0].to(device)
        if real_cpu.dim() == 3:  # If the shape is (N, H, W)
            real_cpu = real_cpu.unsqueeze(1)  # Add channel dimension: (N, 1, H, W)

        ############################
        # (1) Update D network
        ############################
        netD.zero_grad()
        b_size = real_cpu.size(0)
        label = torch.full((b_size,), real_label, device=device).float()  # Ensure the label is Float
        output = netD(real_cpu).view(-1)
        errD_real = criterion(output, label)
        errD_real.backward()
        D_x = output.mean().item()

        # Train with all-fake batch
        noise = torch.randn(b_size, nz, 1, 1, device=device)
        fake = netG(noise)
        label.fill_(fake_label).float()  # Ensure the label is Float
        output = netD(fake.detach()).view(-1)
        errD_fake = criterion(output, label)
        errD_fake.backward()
        D_G_z1 = output.mean().item()
        errD = errD_real + errD_fake
        optimizerD.step()

        ############################
        # (2) Update G network
        ############################
        netG.zero_grad()
        label.fill_(real_label).float()  # Ensure the label is Float
        output = netD(fake).view(-1)
        errG = criterion(output, label)
        errG.backward()
        D_G_z2 = output.mean().item()
        optimizerG.step()
        # Output training stats
        if i % 50 == 0:
            print('[%d/%d][%d/%d]\tLoss_D: %.4f\tLoss_G: %.4f\tD(x): %.4f\tD(G(z)): %.4f / %.4f'
                  % (epoch, num_epochs, i, len(data_loader),
                     errD.item(), errG.item(), D_x, D_G_z1, D_G_z2))

        # Save Losses for plotting later
        G_losses.append(errG.item())
        D_losses.append(errD.item())

        # Check how the generator is doing by saving G's output on fixed_noise
        if (iters % 500 == 0) or ((epoch == num_epochs-1) and (i == len(data_loader)-1)):
            with torch.no_grad():
                fake = netG(fixed_noise).detach().cpu()
            img_list.append(vutils.make_grid(fake, padding=2, normalize=True))
            # Log the losses to wandb
            wandb.log({"Loss_D": errD.item(), "Loss_G": errG.item(), "D(x)": D_x, "D(G(z1))": D_G_z1, "D(G(z2))": D_G_z2})
    
        # Log generated images to wandb after every epoch
        log_generated_images(netG, epoch, num_images=16)

        # Save the model checkpoints
        torch.save(netG.state_dict(), f"netG_epoch_{epoch}.pth")
        torch.save(netD.state_dict(), f"netD_epoch_{epoch}.pth")

        iters += 1

# --- Cell 46 ---
class CustomImageDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        # Filter to only include images with 'interior' in their filename
        keywords = ['room','bed','living','kitchen','bath','sofa','table','dinning']
        self.image_files = [
            f for f in os.listdir(root_dir)
            if any(keyword in f.lower() for keyword in keywords) and f.endswith(('.png', '.jpg', '.jpeg'))
        ]
    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx):
        img_name = os.path.join(self.root_dir, self.image_files[idx])
        image = Image.open(img_name)

        if self.transform:
            image = self.transform(image)

        return image

# --- Cell 47 ---
transform = transforms.Compose([
    transforms.Resize((64, 64), interpolation=Image.LANCZOS),  # High-quality interpolation
    transforms.Grayscale(num_output_channels=1),  # Convert to grayscale
    transforms.ToTensor(),  # Convert images to PyTorch tensors
    transforms.Normalize(mean=[0.5], std=[0.5]),  # Normalize
])

# --- Cell 48 ---
image_dataset = CustomImageDataset(root_dir=dataset_path, transform=transform)

# Create a DataLoader
data_loader = DataLoader(image_dataset, batch_size=128, shuffle=True)  # Adjust batch size as needed

# --- Cell 49 ---
total_images = len(image_dataset)
print(f'Total number of images in the dataset: {total_images}')


# --- Cell 50 ---
for images in data_loader:
    show_images(images, num_images=16)
    break

# --- Cell 53 ---
wandb.init(project='wgan-architecture-v4')

# --- Cell 55 ---
### hyperparameters and general parameters
n_epochs = 100
batch_size = 128
ngpu = 1
lr=5e-5
z_dim=100
device = torch.device("cuda:0" if (torch.cuda.is_available() and ngpu > 0) else "cpu")

cur_step=0
crit_cycles=5
gen_losses=[]
crit_losses=[]
show_step=1
save_step=5

# --- Cell 56 ---
def log_generated_images(generator, epoch, num_images=16):
    # Create a batch of latent vectors
    latent_vectors = torch.randn(num_images, z_dim, 1, 1).to(device)  # Use z_dim instead of latent_dim
    generated_images = generator(latent_vectors)

    # Convert to numpy and unnormalize
    generated_images = generated_images.detach().cpu().numpy()  # Shape: (num_images, 1, 64, 64)
    
    # Rescale from [-1, 1] to [0, 1] for logging
    generated_images = (generated_images + 1) / 2  # Ensure values are in the range [0, 1]
    
    # Log images to WandB
    wandb.log({f'generated_images_epoch_{epoch}': [wandb.Image(img[0], caption=f"Image {i}") for i, img in enumerate(generated_images)]})


# --- Cell 58 ---
class Generator(nn.Module):
    def __init__(self, z_dim=100, d_dim=16):
        super(Generator, self).__init__()
        self.z_dim = z_dim

        self.gen = nn.Sequential(
            nn.ConvTranspose2d(z_dim, d_dim * 32, 4, 1, 0),  # Output: (128, 512, 4, 4)
            nn.BatchNorm2d(d_dim * 32),
            nn.ReLU(True),

            nn.ConvTranspose2d(d_dim * 32, d_dim * 16, 4, 2, 1),  # Output: (128, 256, 8, 8)
            nn.BatchNorm2d(d_dim * 16),
            nn.ReLU(True),

            nn.ConvTranspose2d(d_dim * 16, d_dim * 8, 4, 2, 1),  # Output: (128, 128, 16, 16)
            nn.BatchNorm2d(d_dim * 8),
            nn.ReLU(True),

            nn.ConvTranspose2d(d_dim * 8, d_dim * 4, 4, 2, 1),  # Output: (128, 64, 32, 32)
            nn.BatchNorm2d(d_dim * 4),
            nn.ReLU(True),

            nn.ConvTranspose2d(d_dim * 4, 1, 4, 2, 1),  # Change this layer to produce (128, 1, 64, 64)
            nn.Tanh() 
        )

    def forward(self, noise):
        x = noise.view(len(noise), self.z_dim, 1, 1)  # Reshape input noise to (batch_size, z_dim, 1, 1)
        return self.gen(x)  # Output should now be (batch_size, 1, 64, 64)


# --- Cell 60 ---
import torch
import torch.nn as nn

class Critic(nn.Module):
    def __init__(self, d_dim=16):
        super(Critic, self).__init__()

        self.crit = nn.Sequential(
            # Conv2d: in_channels, out_channels, kernel_size, stride=1, padding=0
            ## New width and height: (n + 2*pad - ks) // stride + 1

            nn.Conv2d(1, d_dim * 2, 4, 2, 1),  # 64x64 -> 32x32 (ch: 1 -> 16)
#             nn.InstanceNorm2d(d_dim),
            nn.LeakyReLU(0.2),

            nn.Conv2d(d_dim * 2, d_dim * 4, 4, 2, 1),  # 32x32 -> 16x16 (ch: 16 -> 32)
#             nn.InstanceNorm2d(d_dim * 2),
            nn.LeakyReLU(0.2),

            nn.Conv2d(d_dim * 4, d_dim * 8, 4, 2, 1),  # 16x16 -> 8x8 (ch: 32 -> 64)
#             nn.InstanceNorm2d(d_dim * 4),
            nn.LeakyReLU(0.2),

            nn.Conv2d(d_dim * 8, d_dim * 16, 4, 2, 1),  # 8x8 -> 4x4 (ch: 64 -> 128)
#             nn.InstanceNorm2d(d_dim * 8),
            nn.LeakyReLU(0.2),

            nn.Conv2d(d_dim * 16, 1, 4, 1, 0),  # 4x4 -> 1x1 (ch: 128 -> 1)
        )

    def forward(self, image):
        # image: (batch_size, 1, 64, 64) for grayscale images
        crit_pred = self.crit(image)  # Output shape: (batch_size, 1, 1, 1)
        return crit_pred.view(len(crit_pred), -1)  # Flatten to (batch_size, 1)


# --- Cell 61 ---
def init_weights(m):
    if isinstance(m, nn.Conv2d) or isinstance(m,nn.ConvTranspose2d):
      torch.nn.init.normal_(m.weight, 0.0, 0.02)
      torch.nn.init.constant_(m.bias,0)

    if isinstance(m,nn.BatchNorm2d):
      torch.nn.init.normal_(m.weight, 0.0, 0.02)
      torch.nn.init.constant_(m.bias,0)





# --- Cell 63 ---
import torch.optim as optim

gen = Generator(z_dim=z_dim).to(device)
crit = Critic().to(device)

# Apply weight initialization
gen.apply(init_weights)
crit.apply(init_weights)

gen_opt = optim.Adam(gen.parameters(), lr=lr, betas=(0.5, 0.999))
crit_opt = optim.Adam(crit.parameters(), lr=lr, betas=(0.5, 0.999))

# --- Cell 64 ---
def get_gp(real, fake, crit, alpha, gamma=10):
    # Mix real and fake images
    mix_images = real * alpha + fake * (1 - alpha)  # Assuming real and fake: (batch_size x 1 x 64 x 64)
    mix_scores = crit(mix_images)  # Critic output shape: (batch_size x 1)

    # Calculate gradients with respect to the mixed images
    gradient = torch.autograd.grad(
        inputs=mix_images,
        outputs=mix_scores,
        grad_outputs=torch.ones_like(mix_scores),
        retain_graph=True,
        create_graph=True,
    )[0]  # Gradient shape: (batch_size x 1 x 64 x 64)

    # Reshape gradient to flatten image pixels for norm calculation
    gradient = gradient.view(len(gradient), -1)  # Reshape to: (batch_size x 4096), because 64 * 64 = 4096
    gradient_norm = gradient.norm(2, dim=1)  # L2 norm across pixels for each image in the batch

    # Calculate gradient penalty
    gp = gamma * ((gradient_norm - 1) ** 2).mean()

    return gp


# --- Cell 65 ---
import torch

def save_checkpoint(filename, model, optimizer, epoch, gen_losses, crit_losses):
    """Save the model checkpoint."""
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'gen_losses': gen_losses,
        'crit_losses': crit_losses
    }
    torch.save(checkpoint, filename)
    print(f"Checkpoint saved to {filename}")


# --- Cell 66 ---
from tqdm import tqdm  # Import tqdm

for epoch in range(n_epochs):
    for real in tqdm(data_loader):  # Unpack only the real images
        cur_bs = len(real)  # batch size (128)
        real = real.to(device)

        ### CRITIC UPDATE
        mean_crit_loss = 0
        for _ in range(crit_cycles):
            crit_opt.zero_grad()

            # Generate noise and fake images
            noise = gen_noise(cur_bs, z_dim, device=device)
            fake = gen(noise)


            # Predictions for fake and real images
            crit_fake_pred = crit(fake.detach())
            crit_real_pred = crit(real)

            # Gradient penalty
            alpha = torch.rand(len(real), 1, 1, 1, device=device, requires_grad=True)  # 128 x 1 x 1 x 1
            gp = get_gp(real, fake.detach(), crit, alpha)

            # Critic loss
            crit_loss = crit_fake_pred.mean() - crit_real_pred.mean() + gp
            mean_crit_loss += crit_loss.item() / crit_cycles

            # Backpropagation and optimization
            crit_loss.backward(retain_graph=True)
            crit_opt.step()

        crit_losses.append(mean_crit_loss)

        ### GENERATOR UPDATE
        gen_opt.zero_grad()

        # Generate noise and fake images
        noise = gen_noise(cur_bs, z_dim, device=device)
        fake = gen(noise)
        crit_fake_pred = crit(fake)

        # Generator loss
        gen_loss = -crit_fake_pred.mean()
        gen_loss.backward()
        gen_opt.step()

        gen_losses.append(gen_loss.item())

        ### WandB Logging
        cur_step += 1

    # Every 5 epochs, log generated images and loss data
    if epoch % 1 == 0:
        # Log losses
        wandb.log({
            'Epoch': epoch,
            'Generator Loss': gen_loss.item(),
            'Critic Loss': mean_crit_loss
        })

        # Log generated images
        log_generated_images(gen, epoch)
    cur_step += 1


# --- Cell 67 ---
import numpy as np
import matplotlib.pyplot as plt

# Function to plot 50 generated images in a 5x10 grid
def plot_generated_images(generator, z_dim, num_images=50, rows=5, cols=10):
    generator.eval()  # Set generator to evaluation mode
    noise = torch.randn(num_images, z_dim, 1, 1, device=device)  # Shape: (num_images, z_dim, 1, 1)
    with torch.no_grad():
        generated_images = generator(noise).cpu()  # Move the generated images to CPU
    generated_images = (generated_images + 1) / 2  # Shape: (num_images, 3, 128, 128)
    fig, axs = plt.subplots(rows, cols, figsize=(cols * 2, rows * 2))

    axs = axs.flatten()  # Flatten the 2D array of axes
    
    for i in range(num_images):
        img = generated_images[i].permute(1, 2, 0).numpy()  # Reshape to (128, 128, 3) for RGB
        axs[i].imshow(img,cmap='gray')
        axs[i].axis('off')  # Turn off the axis for a clean look
    
    plt.tight_layout()
    plt.show()

plot_generated_images(gen, z_dim=100, num_images=50, rows=5, cols=10)


# --- Cell 68 ---
plot_generated_images(gen, z_dim=100, num_images=50, rows=5, cols=10)


# --- Cell 75 ---
wandb.init(project='wgan-architecture-v5')

# --- Cell 76 ---
class CustomImageDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        # Filter to only include images with 'interior' in their filename
        keywords = ['room','bed','living','kitchen','bath','sofa','table','dinning']
        self.image_files = [
            f for f in os.listdir(root_dir)
            if any(keyword in f.lower() for keyword in keywords) and f.endswith(('.png', '.jpg', '.jpeg'))
        ]
    def __len__(self):
        return len(self.image_files)

    def __getitem__(self, idx):
        img_name = os.path.join(self.root_dir, self.image_files[idx])
        image = Image.open(img_name)

        if self.transform:
            image = self.transform(image)

        return image

